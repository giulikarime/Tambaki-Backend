import { IsString, IsNumber, IsDateString, IsNotEmpty, IsEnum } from 'class-validator'
import { costCategory, costType } from '../../generated/prisma/client';

export class CreateCostDto {

  @IsEnum(costCategory)
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  costCategory!: costCategory

  @IsEnum(costType)
  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  costType!: costType  

  @IsNumber()
  @IsNotEmpty({ message: 'O valor é obrigatório' })
  amount!: number

  @IsDateString()
  @IsNotEmpty({ message: 'A data é obrigatória' })
  date!: Date
}