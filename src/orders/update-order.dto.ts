import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { OrderStatus, ServiceType } from '../../generated/prisma/client';

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(ServiceType)
  service_type?: ServiceType;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsInt()
  tableId?: number;
}