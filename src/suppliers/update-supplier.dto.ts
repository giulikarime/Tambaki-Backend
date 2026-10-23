import { IsArray, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ProductsCategory } from '../../generated/prisma/enums';

export class UpdateSupplierDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O nome da empresa não pode ser vazio.' })
  company_name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O nome fantasia não pode ser vazio.' })
  trade_name?: string;

  @IsOptional()
  @IsString()
  cnpj?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O telefone não pode ser vazio.' })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'O e-mail deve ser um e-mail válido.' })
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O endereço não pode ser vazio.' })
  adress?: string;

  @IsOptional()
  @IsEnum(ProductsCategory, { each: true, message: 'Categoria de produto inválida.' })
  category?: ProductsCategory[];

  @IsOptional()
  @IsString()
  url_document?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O nome do responsável não pode ser vazio.' })
  resposible_name?: string;

  @IsOptional()
  @IsInt()
  lead_time_days?: number;
}
