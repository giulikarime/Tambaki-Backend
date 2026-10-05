import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUnitDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome da empresa é obrigatório.' })
    company_name!: string;

    @IsString()
    @IsNotEmpty({ message: 'O nome fantasia é obrigatório.' })
    trade_name!: string;

    @IsString()
    @IsNotEmpty({ message: 'O CNPJ é obrigatório.' })
    cnpj!: string;

    @IsString()
    @IsNotEmpty({ message: 'O endereço é obrigatório.' })
    adress!: string;

    @IsEmail({}, { message: 'Informe um e-mail válido.' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'O telefone é obrigatório.' })
    phone!: string;
}