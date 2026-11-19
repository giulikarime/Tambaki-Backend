import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MenuCategory, Allergens } from '../../generated/prisma/client';
import { TagInputDto } from './create-menu.dto';

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(MenuCategory, { message: 'Categoria de menu inválida.' })
  category?: MenuCategory;

  @IsOptional()
  @IsNumber({})
  @Min(1, { message: 'O preço do menu deve ser maior que zero.' })
  price?: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  img?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(Allergens, { each: true, message: 'Alérgeno inválido.' })
  allergens?: Allergens[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagInputDto)
  tags?: TagInputDto[];
}
