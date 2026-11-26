import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
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
  @Matches(/^\d{10,11}$/)
  phone?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantityPeople?: number;

  @IsOptional()
  @IsDateString()
  startsAtDate?: string;

  @IsOptional()
  @IsDateString()
  startsAtHours?: string;

  @IsOptional()
  @IsDateString()
  endsAtDate?: string;

  @IsOptional()
  @IsDateString()
  endsAtHours?: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsOptional()
  @IsInt()
  tableId?: number;
}