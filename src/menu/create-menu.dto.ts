import { IsArray,IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagInputDto)
  tags?: TagInputDto[];
}

class TagInputDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  color?: string;
}