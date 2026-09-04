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

export class UpdateReservationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantityPeople?: number;

  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsOptional()
  @IsInt()
  tableId?: number;
}