import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ProductsCategory } from "../../generated/prisma/enums";

export class RegisterSupplierDto {
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
    @IsNotEmpty({ message: 'O telefone é obrigatório.' })
    phone!: string;

    @IsEmail({}, { message: 'O e-mail é obrigatório.' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
    email!: string;

    @IsString()
    @IsNotEmpty({ message: 'O endereço é obrigatório.' })
    adress!: string;

    @IsEnum(ProductsCategory, { message: 'Categoria de produto inválida.' })
    category!: ProductsCategory;

    @IsOptional()
    @IsString()
    url_document?: string;

    @IsString()
    @IsNotEmpty({ message: 'O horario de funcionamento é obrigatório.' })
    businnes_hours!: string;

    @IsString()
    @IsNotEmpty({ message: 'O nome do resposável é obrigatório.' })
    resposible_name!: string;

    @IsString()
    @IsNotEmpty({ message: 'As condições de pagamento são obrigatórias.' })
    payment_terms!: string;

    @IsInt()
    @IsNotEmpty({ message: 'O prazo de entrega é obrigatório.' })
    lead_time_days!: number;
}