import { IsString, IsNumber, IsDateString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator'
import { costCategory, costType } from '../../generated/prisma/client';

export class UpdateCostDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'O nome não pode ser vazio' })
    name?: string

    @IsOptional()
    @IsEnum(costCategory)
    @IsNotEmpty({ message: 'A categoria não pode ser vazia' })
    costCategory?: costCategory

    @IsOptional()
    @IsEnum(costType)
    @IsNotEmpty({ message: 'O tipo não pode ser vazio' })
    costType?: costType

    @IsOptional()
    @IsNumber()
    @IsNotEmpty({ message: 'O valor não pode ser vazio' })
    value?: number

    @IsOptional()
    @IsDateString()
    @IsNotEmpty({ message: 'A data não pode ser vazia' })
    date?: Date
}