import {
	IsBoolean,
	IsDateString,
	IsEmail,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
	MinLength,
} from 'class-validator';
import { AcessLevel, EmployType, ShiftType } from '../../generated/prisma/enums';

export class RegisterUserDto {
	@IsString()
	@IsNotEmpty({ message: 'O nome é obrigatório.' })
	name!: string;

	@IsString()
	@IsNotEmpty({ message: 'O CPF é obrigatório.' })
	cpf!: string;

	@IsEmail({}, { message: 'E-mail inválido.' })
	@IsNotEmpty({ message: 'O e-mail é obrigatório.' })
	email!: string;

	@IsString()
	@IsNotEmpty({ message: 'O telefone é obrigatório.' })
	phone!: string;

	@IsString()
	@MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
	password!: string;

	@IsString()
	@IsNotEmpty({ message: 'A função é obrigatória.' })
	role!: string;

	@IsOptional()
	@IsBoolean({ message: 'O status ativo deve ser true ou false.' })
	active?: boolean;

	@IsEnum(AcessLevel, { message: 'Nível de acesso inválido.' })
	acess_level!: AcessLevel;

	@IsEnum(EmployType, { message: 'Tipo de contratação inválido.' })
	employ_type!: EmployType;

	@IsEnum(ShiftType, { message: 'Turno inválido.' })
	shift!: ShiftType;

	@IsOptional()
	@IsDateString({}, { message: 'A data de contratação deve ser válida.' })
	hire_date?: string;

	@IsOptional()
	@IsInt({ message: 'A carga horária semanal deve ser um número inteiro.' })
	@Min(0)
	weekly_hours?: number;

	@IsOptional()
	@IsNumber({}, { message: 'O salário deve ser um número.' })
	@Min(0)
	salary?: number;

	@IsOptional()
	@IsString()
	bankName?: string;

	@IsInt({ message: 'A unidade deve ser um número inteiro.' })
	@Min(1)
	storeUnitId!: number;
}
