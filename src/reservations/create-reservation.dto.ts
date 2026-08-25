import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ReservationStatus } from '../../generated/prisma/client';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsInt()
  @Min(1)
  quantityPeople!: number;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsInt()
  @IsNotEmpty()
  tableId!: number;

  @IsOptional()
  @IsEnum(ReservationStatus, {
    message: 'status inválido. Use: Pendente, Confirmada, Cancelada, Concluida ou NoShow.',
  })
  status?: ReservationStatus;

  @IsOptional()
  @IsInt()
  unitId?: number;
}