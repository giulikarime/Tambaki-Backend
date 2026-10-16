import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ProductsCategory } from '../../generated/prisma/client';

export class CmvQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  @Type(() => Number)
  @IsInt()
  @Min(2000)
  year!: number;

  @Type(() => Number)
  @IsInt()
  unitId!: number;

  @IsOptional()
  @IsEnum(ProductsCategory)
  category?: ProductsCategory;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  leadTimeMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  leadTimeMax?: number;
}