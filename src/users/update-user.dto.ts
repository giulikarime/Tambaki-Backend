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

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty({ message: 'O nome não pode ser vazio.' })
	name?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty({ message: 'O CPF não pode ser vazio.' })
	cpf?: string;

	@IsOptional()
	@IsEmail({}, { message: 'E-mail inválido.' })
	@IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
	email?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty({ message: 'O telefone não pode ser vazio.' })
	phone?: string;

	@IsOptional()
	@IsString()
	@MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
	password?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty({ message: 'A função não pode ser vazia.' })
	role?: string;

	@IsOptional()
	@IsBoolean({ message: 'O status ativo deve ser true ou false.' })
	active?: boolean;

	@IsOptional()
	@IsEnum(AcessLevel, { message: 'Nível de acesso inválido.' })
	acess_level?: AcessLevel;

	@IsOptional()
	@IsEnum(EmployType, { message: 'Tipo de contratação inválido.' })
	employ_type?: EmployType;

	@IsOptional()
	@IsEnum(ShiftType, { message: 'Turno inválido.' })
	shift?: ShiftType;

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

	@IsOptional()
	@IsInt({ message: 'A unidade deve ser um número inteiro.' })
	@Min(1)
	storeUnitId?: number;
}