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
import { Allergens, ProductsCategory } from '../../generated/prisma/enums';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do produto é obrigatório.' })
  name!: string;

  @IsNumber({}, { message: 'O preço de custo deve ser um número.' })
  @Min(0, { message: 'O preço de custo não pode ser negativo.' })
  cost_price!: number;

  @IsEnum(ProductsCategory, { message: 'Categoria de produto inválida.' })
  category!: ProductsCategory;

  @IsString()
  @IsNotEmpty({ message: 'A marca é obrigatória.' })
  brand!: string;

  @IsArray()
  @IsEnum(Allergens, { each: true, message: 'Alérgeno inválido.' })
  @IsOptional()
  allergens?: Allergens[];

  @IsInt()
  @Min(0, { message: 'A quantidade em estoque não pode ser negativa.' })
  stock_quantity!: number;

  @IsString()
  @IsNotEmpty({ message: 'A unidade de medida é obrigatória.' })
  unit_of_measure!: string;

  @IsInt()
  @Min(0, { message: 'O estoque atual não pode ser negativo.' })
  current_stock!: number;

  @IsInt()
  @Min(0, { message: 'O estoque mínimo não pode ser negativo.' })
  min_stock!: number;

  @IsDateString({}, { message: 'Data de fabricação inválida.' })
  manufacture_date!: string;

  @IsDateString({}, { message: 'Data de validade inválida.' })
  expiration_date!: string;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsInt()
  @IsNotEmpty({ message: 'O fornecedor é obrigatório.' })
  supplierId!: number;

  @IsInt()
  @IsNotEmpty({ message: 'A unidade (loja) é obrigatória.' })
  unitId!: number;
}