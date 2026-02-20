import {Inject, Injectable} from '@nestjs/common'
import {CACHE_MANAGER} from '@nestjs/cache-manager'
import type {Cache} from 'cache-manager'
import {SquareClient} from 'square'
import {
  CategoryGroupDTO,
  CategoryListDTO,
  MenuItemDTO,
  MenuItemVariation
} from '@per-diem/types'

@Injectable()
export class CatalogService {
  /**
   * @param squareClient - Official Square SDK instance
   * @param cacheManager - Cache manager (Redis/In-memory) to reduce Square API load
   */
  constructor(
    @Inject('SQUARE_CLIENT') private readonly squareClient: SquareClient,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * Converts Square's minor currency units (cents) to a localized USD string.
   * Square API returns prices as bigints (e.g., 100 for $1.00).
   */
  private formatPrice(amount?: bigint | number | null): string {
    if (amount === undefined || amount === null) return '';
    const val = Number(amount) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  }

  /**
   * Retrieves and transforms the full Square catalog for a specific location.
   * Includes automated handling of pagination, category mapping, and image resolution.
   * Implements caching for 5 minutes (300,000ms) to avoid hitting Square rate limits.
   * * @param locationId - Unique Square location identifier
   * @returns Hierarchical structure of categories and their respective menu items
   */
  async getFullCatalog(locationId: string): Promise<CategoryGroupDTO[]> {
    const cacheKey = `catalog_${locationId}`;
    const cached = await this.cacheManager.get<CategoryGroupDTO[]>(cacheKey);
    if (cached) return cached;

    const items: MenuItemDTO[] = [];
    const categoryMap = new Map<string, string>();
    const imageMap = new Map<string, string>();
    let cursor: string | undefined = undefined;

    try {
      do {
        const response = await this.squareClient.catalog.search({
          cursor,
          objectTypes: ['ITEM'],
          includeRelatedObjects: true,
        });

        if (response.relatedObjects) {
          for (const obj of response.relatedObjects) {
            if (obj.id) {
              if (obj.type === 'CATEGORY' && obj.categoryData && obj.categoryData.name) {
                categoryMap.set(obj.id, obj.categoryData.name);
              }
              if (obj.type === 'IMAGE' && obj.imageData && obj.imageData.url) {
                imageMap.set(obj.id, obj.imageData.url);
              }
            }
          }
        }

        if (response.objects) {
          for (const obj of response.objects) {
            if (obj.type !== 'ITEM' || !obj.itemData) continue;

            const isPresentAtAll = obj.presentAtAllLocations === true;
            const absentIds = obj.absentAtLocationIds || [];
            const presentIds = obj.presentAtLocationIds || [];

            // Logical check: filter items based on Square's location availability rules.
            // An item might be available globally but explicitly excluded from certain locations,
            // or only available in a whitelist of IDs.
            if (isPresentAtAll && absentIds.includes(locationId)) {
              continue;
            }
            if (!isPresentAtAll && !presentIds.includes(locationId)) {
              continue;
            }

            const data = obj.itemData;

            if (obj.isDeleted) continue;

            const variations: MenuItemVariation[] = [];

            if (data.variations) {
              for (const v of data.variations) {
                if (v.type !== 'ITEM_VARIATION' || !v.itemVariationData) {
                  continue;
                }

                const vData = v.itemVariationData;

                variations.push({
                  id: v.id,
                  name: vData.name || '',
                  price: this.formatPrice(vData.priceMoney?.amount),
                });
              }
            }

            const categoryId = data.categories?.[0]?.id || data.categoryId;
            const categoryName = categoryId ? categoryMap.get(categoryId) || 'Other' : 'Other';

            items.push({
              id: obj.id,
              name: data.name || 'Unnamed',
              description: data.description || '',
              category: categoryName,
              image_url: data.imageIds ? imageMap.get(data.imageIds[0]) || null : null,
              variations,
            });
          }
        }

        cursor = response.cursor;
      } while (cursor);

      const grouped: Record<string, MenuItemDTO[]> = {};
      items.forEach((item) => {
        const cat = item.category;
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
      });

      const response = Object.entries(grouped).map(([name, items]) => ({
        category_name: name,
        items,
      }));

      await this.cacheManager.set(cacheKey, response, 300000);
      return response;

    } catch (e) {
      console.error('Catalog Error:', e);
      throw e;
    }
  }

  /**
   * Extracts a simplified list of categories with item counts for navigation components.
   * Reuses the cached full catalog to ensure data consistency and performance.
   */
  async getCategories(locationId: string): Promise<CategoryListDTO[]> {
    const catalog = await this.getFullCatalog(locationId);
    return catalog.map((c) => ({
      id: c.category_name,
      name: c.category_name,
      item_count: c.items.length,
    }));
  }
}