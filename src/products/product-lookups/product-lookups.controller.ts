import { Controller, Get } from '@nestjs/common';
import { ProductLookupsService } from './product-lookups.service';

@Controller('product-lookups')
export class ProductLookupsController {
  constructor(private readonly lookupsService: ProductLookupsService) {}

  @Get('categories')
  findAllCategories() {
    return this.lookupsService.findAllCategories();
  }

  @Get('brands')
  findAllBrands() {
    return this.lookupsService.findAllBrands();
  }

  @Get('storage-locations')
  findAllStorageLocations() {
    return this.lookupsService.findAllStorageLocations();
  }

  @Get('batches')
  findAllBatches() {
    return this.lookupsService.findAllBatches();
  }
}