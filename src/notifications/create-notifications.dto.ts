import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateNotificationsDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  produtoID?: number;
}
