import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  menuId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}