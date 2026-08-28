import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Allergens, ProductsCategory } from '../generated/prisma/client';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O nome do produto não pode ser vazio.' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'O preço de custo deve ser um número.' })
  @Min(0, { message: 'O preço de custo não pode ser negativo.' })
  cost_price?: number;

  @IsOptional()
  @IsEnum(ProductsCategory, { message: 'Categoria de produto inválida.' })
  category?: ProductsCategory;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'A marca não pode ser vazia.' })
  brand?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Allergens, { each: true, message: 'Alérgeno inválido.' })
  allergens?: Allergens[];

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'A quantidade em estoque não pode ser negativa.' })
  stock_quantity?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'A unidade de medida não pode ser vazia.' })
  unit_of_measure?: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'O estoque atual não pode ser negativo.' })
  current_stock?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'O estoque mínimo não pode ser negativo.' })
  min_stock?: number;

  @IsOptional()
  @IsDateString({}, { message: 'Data de fabricação inválida.' })
  manufacture_date?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de validade inválida.' })
  expiration_date?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsInt()
  @IsNotEmpty({ message: 'O fornecedor é obrigatório.' })
  supplierId?: number;

  @IsOptional()
  @IsInt()
  @IsNotEmpty({ message: 'A unidade (loja) é obrigatória.' })
  unitId?: number;
}