import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { TableStatus } from '../../generated/prisma/client';

export class UpdateTableDto {
  @IsOptional()
  @IsInt({ message: 'O número da mesa deve ser um número inteiro.' })
  @Min(1, { message: 'O número da mesa deve ser maior que zero.' })
  table_number?: number;

  @IsOptional()
  @IsInt({ message: 'A capacidade deve ser um número inteiro.' })
  @Min(1, { message: 'A capacidade deve ser de pelo menos 1 pessoa.' })
  capacity?: number;

  @IsOptional()
  @IsEnum(TableStatus, { message: 'Status inválido. Use: Livre, Ocupado ou Reservado.' })
  status?: TableStatus;

  @IsOptional()
  @IsInt({ message: 'unitId deve ser um número inteiro.' })
  unitId?: number;
}