import { Module } from '@nestjs/common';
import { ProductLookupsController } from './product-lookups.controller';
import { ProductLookupsService } from './product-lookups.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductLookupsController],
  providers: [ProductLookupsService],
  exports: [ProductLookupsService], // ← faltava isso
})
export class ProductLookupsModule {}