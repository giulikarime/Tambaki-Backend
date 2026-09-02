import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsInt()
  cnpj?: number;

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
  @IsString()
  @IsNotEmpty({ message: 'O horário de funcionamento não pode ser vazio.' })
  businnes_hours?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O nome do responsável não pode ser vazio.' })
  resposible_name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'As condições de pagamento não podem ser vazias.' })
  payment_terms?: string;

  @IsOptional()
  @IsInt()
  lead_time_days?: number;
}
