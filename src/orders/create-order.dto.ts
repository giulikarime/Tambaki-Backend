import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ServiceType, OrderStatus } from '../../generated/prisma/client';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  tableId!: number;

  @IsEnum(ServiceType, { message: 'service_type inválido. Use: Mesa ou Balcao.' })
  service_type!: ServiceType;

  @IsOptional()
  @IsEnum(OrderStatus, { message: 'status inválido. Use: Aberta, Fechada ou Paga.' })
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