import { IsArray,IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MenuCategory, Allergens } from '../../generated/prisma/client';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty({message: 'O nome do menu é obrigatório.'})
  name!: string;

  @IsString()
  @IsNotEmpty({message: 'A descrição do menu é obrigatória.'})
  description!: string;

  @IsEnum(MenuCategory, {message: 'Categoria de menu inválida.'})
  @IsNotEmpty({message: 'A categoria do menu é obrigatória.'})
  category!: MenuCategory;

  @IsNumber()
  @Min(1, {message: 'O preço do menu deve ser maior que zero.'})
  price!: number;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  img?: string[];

  @IsArray()
  @IsEnum(Allergens, { each: true, message: 'Alérgeno inválido.' })
  allergens!: Allergens[];

  @IsInt()
  @IsNotEmpty({message: 'O ID da unidade é obrigatório.'})
  unitId!: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagInputDto)
  tags?: TagInputDto[];
}

class TagInputDto {
  @IsString()
  @IsNotEmpty({message: 'O nome da tag é obrigatória.'})
  name!: string;

  @IsOptional()
  @IsString()
  color?: string;
}