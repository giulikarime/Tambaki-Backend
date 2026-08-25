import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { TableStatus } from '../../generated/prisma/client';

export class CreateTableDto {
  @IsInt({ message: 'O número da mesa deve ser um número inteiro.' })
  @Min(1, { message: 'O número da mesa deve ser maior que zero.' })
  table_number!: number;

  @IsInt({ message: 'A capacidade deve ser um número inteiro.' })
  @Min(1, { message: 'A capacidade deve ser de pelo menos 1 pessoa.' })
  capacity!: number;

  @IsEnum(TableStatus, { message: 'Status inválido. Use: Livre, Ocupado ou Reservado.' })
  status!: TableStatus;

  @IsInt({ message: 'unitId deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'unitId é obrigatório.' })
  unitId!: number;
}