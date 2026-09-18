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
import { Allergens, ProductsCategory, ProductStatus, ProductStorageLocation, UnitOfMeasure } from '../../generated/prisma/enums';

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

  @IsEnum(UnitOfMeasure,{ message: 'A unidade de medida é obrigatória.' })
  unit_of_measure!: UnitOfMeasure;

  @IsInt()
  @Min(0, { message: 'O estoque mínimo não pode ser negativo.' })
  min_stock!: number;

  @IsInt()
  @Min(0, { message: 'O estoque máximo não pode ser negativo.' })
  max_stock!: number;

  @IsDateString({}, { message: 'Data de fabricação inválida.' })
  manufacture_date!: string;

  @IsDateString({}, { message: 'Data de validade inválida.' })
  expiration_date!: string;

  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @IsEnum(ProductStorageLocation, { message: 'Local de armazenamento inválido.' })
  storageLocation!: ProductStorageLocation;

  @IsEnum(ProductStatus, { message: 'Status inválido. Use "Ativo", "Inativo" ou "Descontinuado".' })
  status!: ProductStatus;


  @IsString()
  @IsNotEmpty({ message: 'O campo de lote é obrigatório.' })
  batch!: string;

  @IsInt()
  @IsNotEmpty({ message: 'O fornecedor é obrigatório.' })
  supplierId!: number;

  @IsInt()
  @IsNotEmpty({ message: 'A unidade (loja) é obrigatória.' })
  unitId!: number;
}