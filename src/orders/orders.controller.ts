import {Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './create-order.dto';
import { AddOrderItemDto } from './add-order-item.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post(':id/items')
  @HttpCode(HttpStatus.CREATED)
  async addItem(@Param('id', ParseIntPipe) id: number, @Body() dto: AddOrderItemDto) {
    return this.ordersService.addItem(id, dto);
  }

  @Patch(':id/close')
  async close(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.close(id);
  }
}