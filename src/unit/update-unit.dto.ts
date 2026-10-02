import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUnitDto {
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
  @IsNotEmpty({ message: 'O endereço não pode ser vazio.' })
  adress?: string;

  @IsOptional()
  @IsEmail({}, { message: 'O e-mail deve ser um e-mail válido.' })
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O telefone não pode ser vazio.' })
  phone?: string;
}