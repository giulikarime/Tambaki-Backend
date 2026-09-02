import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MenuCategory } from '../../generated/prisma/client';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(MenuCategory)
  category!: MenuCategory;

  @IsNumber()
  @Min(1)
  price!: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsInt()
  @IsNotEmpty()
  unitId!: number;
}