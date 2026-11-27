import { IsInt, Min } from 'class-validator';

export class UpdateOrderItemDto {
  @IsInt()
  @Min(0)
  quantity!: number;
}
