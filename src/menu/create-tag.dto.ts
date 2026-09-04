import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  color?: string;
}