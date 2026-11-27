import { BadRequestException } from '@nestjs/common';
import type { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from './orders.service';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('OrdersService open orders', () => {
  it('returns only the summary fields needed by the open tickets screen', async () => {
    const orders = [
      { id: 20, nameClient: 'Cliente', tableId: 5, status: 'Aberta' },
    ];
    const findMany = jest.fn().mockResolvedValue(orders);
    const service = new OrdersService({
      order: { findMany },
    } as unknown as PrismaService);

    await expect(service.findOpen()).resolves.toEqual(orders);
    expect(findMany).toHaveBeenCalledWith({
      where: { status: 'Aberta' },
      select: {
        id: true,
        nameClient: true,
        tableId: true,
        status: true,
      },
    });
  });
});

describe('OrdersService reservation check-in', () => {
  let transaction: {
    table: { findUnique: jest.Mock; update: jest.Mock };
    reservation: { findUnique: jest.Mock; updateMany: jest.Mock };
    order: { create: jest.Mock };
  };
  let prisma: { $transaction: jest.Mock };
  let service: OrdersService;

  beforeEach(() => {
    transaction = {
      table: {
        findUnique: jest.fn().mockResolvedValue({
          id: 5,
          unitId: 2,
          status: 'Reservado',
        }),
        update: jest.fn().mockResolvedValue({}),
      },
      reservation: {
        findUnique: jest.fn(),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      order: {
        create: jest.fn().mockResolvedValue({ id: 20 }),
      },
    };
    prisma = {
      $transaction: jest.fn(
        async (callback: (tx: typeof transaction) => Promise<unknown>) =>
          callback(transaction),
      ),
    };
    service = new OrdersService(prisma as unknown as PrismaService);
  });

  it('confirms the matching reservation when its order is created', async () => {
    transaction.reservation.findUnique.mockResolvedValue({
      id: 8,
      tableId: 5,
      status: 'Pendente',
      startsAtDate: new Date(2099, 0, 1),
      startsAtHours: new Date(1970, 0, 1, 18),
    });

    await expect(
      service.create({
        nameClient: 'Cliente',
        tableId: 5,
        reservationId: 8,
        service_type: 'Mesa',
      }),
    ).resolves.toEqual({
      message: 'Comanda aberta com sucesso!',
      order: { id: 20 },
    });

    expect(transaction.reservation.updateMany).toHaveBeenCalledWith({
      where: { id: 8, tableId: 5, status: 'Pendente' },
      data: { status: 'Confirmada' },
    });
    expect(transaction.table.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { status: 'Ocupado' },
    });
  });

  describe('OrdersService item quantity updates', () => {
    let transaction: {
      order: { findUnique: jest.Mock; update: jest.Mock };
      orderItem: { findFirst: jest.Mock; update: jest.Mock; delete: jest.Mock };
    };
    let service: OrdersService;

    beforeEach(() => {
      transaction = {
        order: {
          findUnique: jest.fn().mockResolvedValue({ id: 20, status: 'Aberta' }),
          update: jest.fn().mockResolvedValue({ id: 20, items: [], table: {} }),
        },
        orderItem: {
          findFirst: jest.fn().mockResolvedValue({
            id: 30,
            orderId: 20,
            quantity: 2,
            unit_price: 12,
          }),
          update: jest.fn().mockResolvedValue({}),
          delete: jest.fn().mockResolvedValue({}),
        },
      };
      const prisma = {
        $transaction: jest.fn(
          async (callback: (tx: typeof transaction) => Promise<unknown>) =>
            callback(transaction),
        ),
      };
      service = new OrdersService(prisma as unknown as PrismaService);
    });

    it('removes the saved item and subtracts its full value when quantity reaches zero', async () => {
      await service.updateItem(20, 30, { quantity: 0 });

      expect(transaction.orderItem.delete).toHaveBeenCalledWith({
        where: { id: 30 },
      });
      expect(transaction.order.update).toHaveBeenCalledWith({
        where: { id: 20 },
        data: { total_value: { increment: -24 } },
        include: { items: { include: { menu: true } }, table: true },
      });
    });

    it('updates the saved quantity and adjusts the order total by the difference', async () => {
      await service.updateItem(20, 30, { quantity: 1 });

      expect(transaction.orderItem.update).toHaveBeenCalledWith({
        where: { id: 30 },
        data: { quantity: 1 },
      });
      expect(transaction.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { total_value: { increment: -12 } },
        }),
      );
      expect(transaction.orderItem.delete).not.toHaveBeenCalled();
    });
  });

  it('cancels an overdue reservation instead of creating its order', async () => {
    const startsAt = new Date(Date.now() - 31 * 60 * 1000);
    transaction.reservation.findUnique.mockResolvedValue({
      id: 8,
      tableId: 5,
      status: 'Pendente',
      startsAtDate: new Date(
        startsAt.getFullYear(),
        startsAt.getMonth(),
        startsAt.getDate(),
      ),
      startsAtHours: startsAt,
    });

    await expect(
      service.create({
        nameClient: 'Cliente',
        tableId: 5,
        reservationId: 8,
        service_type: 'Mesa',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(transaction.reservation.updateMany).toHaveBeenCalledWith({
      where: { id: 8, status: 'Pendente' },
      data: { status: 'Cancelada' },
    });
    expect(transaction.order.create).not.toHaveBeenCalled();
  });
});
