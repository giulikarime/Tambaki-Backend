import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './create-order.dto';
import { AddOrderItemDto } from './add-order-item.dto';
import { UpdateOrderDto } from './update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const table = await this.prisma.table.findUnique({ where: { id: dto.tableId } });
    if (!table) {
      throw new NotFoundException('Mesa não encontrada.');
    }

    const order = await this.prisma.order.create({
      data: {
        tableId: table.id,
        unitId: table.unitId,
        service_type: dto.service_type,
      },
    });

    if (table.status === 'Livre') {
      await this.prisma.table.update({
        where: { id: table.id },
        data: { status: 'Ocupado' },
      });
    }

    return { message: 'Comanda aberta com sucesso!', order };
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { menu: true } }, table: true },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { menu: true } }, table: true },
    });
    if (!order) {
      throw new NotFoundException('Comanda não encontrada.');
    }
    return order;
  }

  async update(id: number, dto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Comanda não encontrada.');
    }

    if (dto.tableId !== undefined) {
      const table = await this.prisma.table.findUnique({ where: { id: dto.tableId } });
      if (!table) {
        throw new NotFoundException('Mesa não encontrada.');
      }
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        service_type: dto.service_type,
        status: dto.status,
        ...(dto.tableId !== undefined ? { tableId: dto.tableId } : {}),
        ...(dto.status === 'Fechada' || dto.status === 'Paga'
          ? { closed_at: order.closed_at ?? new Date() }
          : {}),
      },
      include: { items: { include: { menu: true } }, table: true },
    });

    return { message: 'Comanda atualizada com sucesso!', order: updatedOrder };
  }

  async delete(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException('Comanda não encontrada.');
    }

    await this.prisma.$transaction(async (transaction) => {
      await transaction.orderItem.deleteMany({ where: { orderId: id } });
      await transaction.order.delete({ where: { id } });

      if (order.status === 'Aberta') {
        const stillOpen = await transaction.order.count({
          where: { tableId: order.tableId, status: 'Aberta' },
        });
        if (stillOpen === 0) {
          await transaction.table.update({
            where: { id: order.tableId },
            data: { status: 'Livre' },
          });
        }
      }
    });

    return { message: 'Comanda excluída com sucesso!' };
  }

  async addItem(orderId: number, dto: AddOrderItemDto) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Comanda não encontrada.');
    }
    if (order.status !== 'Aberta') {
      throw new BadRequestException('Só é possível adicionar itens em comandas abertas.');
    }

    const menuItem = await this.prisma.menu.findUnique({ where: { id: dto.menuId } });
    if (!menuItem) {
      throw new NotFoundException('Item de menu não encontrado.');
    }

    const item = await this.prisma.orderItem.create({
      data: {
        orderId,
        menuId: dto.menuId,
        quantity: dto.quantity,
        unit_price: menuItem.price,
      },
    });

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { total_value: { increment: menuItem.price * dto.quantity } },
    });

    return { message: 'Item adicionado com sucesso!', item, order: updatedOrder };
  }

  async close(orderId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Comanda não encontrada.');
    }
    if (order.status !== 'Aberta') {
      throw new BadRequestException('Essa comanda já está fechada.');
    }

    const closedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'Fechada', closed_at: new Date() },
    });

    const stillOpen = await this.prisma.order.count({
      where: { tableId: order.tableId, status: 'Aberta' },
    });

    if (stillOpen === 0) {
      await this.prisma.table.update({
        where: { id: order.tableId },
        data: { status: 'Livre' },
      });
    }

    return { message: 'Comanda fechada com sucesso!', order: closedOrder };
  }
}