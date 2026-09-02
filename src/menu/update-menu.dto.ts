import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MenuCategory } from '../../generated/prisma/client';

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(MenuCategory)
  category?: MenuCategory;

  @IsOptional()
  @IsNumber({})
  @Min(1)
  price?: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  
}










