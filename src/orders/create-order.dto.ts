import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsNumber, IsString} from 'class-validator';
import { ServiceType, OrderStatus } from '../../generated/prisma/client';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  nameClient!: string;

  @IsInt()
  @IsNotEmpty()
  tableId!: number;

  @IsEnum(ServiceType)
  service_type!: ServiceType;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsNumber()
  total_value?: number;

  @IsOptional()
  @IsInt()
  unitId?: number;

  @IsOptional()
  @IsInt()
  menuId?: number;
}