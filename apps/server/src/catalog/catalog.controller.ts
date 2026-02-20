import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  async getCatalog(@Query('location_id') locationId: string) {
    if (!locationId) {
      throw new BadRequestException('location_id is required');
    }
    return this.catalogService.getFullCatalog(locationId);
  }

  @Get('categories')
  async getCategories(@Query('location_id') locationId: string) {
    if (!locationId) {
      throw new BadRequestException('location_id is required');
    }
    return this.catalogService.getCategories(locationId);
  }
}