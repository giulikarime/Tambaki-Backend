import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterClientDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name!: string;

  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  phone!: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome do restaurante é obrigatório.' })
  restaurant!: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'O nível de acesso é obrigatório.' })
  acess_level!: string;

  @IsBoolean()
  status!: boolean;
}