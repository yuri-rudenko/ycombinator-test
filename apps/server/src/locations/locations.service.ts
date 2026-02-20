import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { SquareClient } from 'square';
import {LocationDTO} from '@per-diem/types'

@Injectable()
export class LocationsService {
  /**
   * @param squareClient - Initialized Square SDK client
   * @param cacheManager - Cache provider to store location data and minimize API round-trips
   */
  constructor(
    @Inject('SQUARE_CLIENT') private readonly squareClient: SquareClient,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * Retrieves a list of all active business locations.
   * Filters out inactive sites and transforms the Square SDK model into a clean LocationDTO.
   * * @cache TTL: 1 hour (3600000 ms) as location data is relatively static.
   * @returns {Promise<LocationDTO[]>} Array of sanitized and active location objects.
   * @throws Will propagate Square API errors after logging.
   */
  async findAll(): Promise<LocationDTO[]> {
    const cacheKey = 'locations_sdk';
    const cached = await this.cacheManager.get<LocationDTO[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.squareClient.locations.list();

      // Ensure we only process ACTIVE locations and map them to our internal DTO.
      // We perform address string concatenation here to simplify frontend rendering.
      const locations: LocationDTO[] = (response.locations || [])
        .filter((l) => l.status === 'ACTIVE')
        .map((l) => ({
          id: l.id!,
          name: l.name || 'Unknown',
          address: l.address
            ? `${l.address.addressLine1 || ''}, ${l.address.locality || ''}`
            : 'No address',
          timezone: l.timezone || 'UTC',
          status: 'ACTIVE',
        }));

      await this.cacheManager.set(cacheKey, locations, 3600000);
      return locations;
    } catch (error) {
      // Log the full error context for observability before throwing it
      // to the Global Exception Filter or Controller.
      console.error('Square Locations Error:', error);
      throw error;
    }
  }
}