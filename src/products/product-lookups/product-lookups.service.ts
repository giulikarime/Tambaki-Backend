import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductsCategory, ProductStorageLocation } from '../../../generated/prisma/enums';

@Injectable()
export class ProductLookupsService {
  constructor(private readonly prisma: PrismaService) {}

  // category and storageLocation are now fixed Prisma enums, not tables.
  // There is no "create" for these anymore — new values require editing
  // schema.prisma and running a migration, since they're compiled into the DB type.

  findAllCategories() {
    return Object.values(ProductsCategory);
  }

  findAllStorageLocations() {
    return Object.values(ProductStorageLocation);
  }

  // brand and batch are now plain VARCHAR columns on Product with no
  // dedicated table. "Creating" one just means saving a Product with that
  // value — nothing to persist ahead of time. These lookups return the
  // distinct values currently in use, e.g. for an autocomplete field.

  async findAllBrands() {
    const rows = await this.prisma.product.findMany({
      distinct: ['brand'],
      select: { brand: true },
      orderBy: { brand: 'asc' },
    });
    return rows.map((r) => r.brand);
  }

  async findAllBatches() {
    const rows = await this.prisma.product.findMany({
      distinct: ['batch'],
      select: { batch: true },
      orderBy: { batch: 'asc' },
    });
    return rows.map((r) => r.batch);
  }
}