import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { CmvEntryType } from '../../generated/prisma/client';

export class CreateCmvEntryDto {
  @IsEnum(CmvEntryType)
  type!: CmvEntryType;

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsDateString()
  date!: string;

  @IsInt()
  unitId!: number;

  @IsOptional()
  @IsInt()
  productId?: number;
}