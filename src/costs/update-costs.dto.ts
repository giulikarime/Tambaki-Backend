import { IsString, IsNumber, IsDateString, IsOptional, IsNotEmpty } from 'class-validator'

export class UpdateCostDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'O tipo não pode ser vazio' })
    type?: string

    @IsOptional()
    @IsNumber()
    @IsNotEmpty({ message: 'O valor não pode ser vazio' })
    value?: number

    @IsOptional()
    @IsDateString()
    @IsNotEmpty({ message: 'A data não pode ser vazia' })
    date?: Date

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'A descrição não pode ser vazia' })
    description?: string
}