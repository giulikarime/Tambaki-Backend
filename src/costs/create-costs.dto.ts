import { IsString, IsNumber, IsDateString, IsNotEmpty, IsEnum } from 'class-validator'
import { costCategory, costType } from '../../generated/prisma/client';

export class CreateCostDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name!: string

  @IsEnum(costCategory)
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  costCategory!: costCategory

  @IsEnum(costType)
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  costType!: costType  

  @IsDateString()
  @IsNotEmpty({ message: 'A data é obrigatória' })
  date!: Date
}