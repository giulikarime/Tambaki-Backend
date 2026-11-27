import type { PrismaService } from '../prisma/prisma.service';
import { ReservationsService } from './reservations.service';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('ReservationsService overdue reservations', () => {
  let prisma: {
    reservation: {
      findMany: jest.Mock;
      updateMany: jest.Mock;
    };
  };
  let service: ReservationsService;

  beforeEach(() => {
    prisma = {
      reservation: {
        findMany: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    service = new ReservationsService(prisma as unknown as PrismaService);
  });

  it('cancels a pending reservation after the 30-minute grace period', async () => {
    const startsAt = new Date(Date.now() - 31 * 60 * 1000);
    prisma.reservation.findMany
      .mockResolvedValueOnce([
        {
          id: 12,
          startsAtDate: new Date(
            startsAt.getFullYear(),
            startsAt.getMonth(),
            startsAt.getDate(),
          ),
          startsAtHours: startsAt,
        },
      ])
      .mockResolvedValueOnce([]);
    prisma.reservation.updateMany.mockResolvedValue({ count: 1 });

    await service.findAll();

    expect(prisma.reservation.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: {
          status: 'Pendente',
          startsAtDate: { lte: expect.any(Date) },
        },
      }),
    );
    expect(prisma.reservation.updateMany).toHaveBeenCalledWith({
      where: { id: { in: [12] }, status: 'Pendente' },
      data: { status: 'Cancelada' },
    });
  });

  it('leaves a pending reservation unchanged before the 30-minute limit', async () => {
    const startsAt = new Date(Date.now() - 29 * 60 * 1000);
    prisma.reservation.findMany
      .mockResolvedValueOnce([
        {
          id: 13,
          startsAtDate: new Date(
            startsAt.getFullYear(),
            startsAt.getMonth(),
            startsAt.getDate(),
          ),
          startsAtHours: startsAt,
        },
      ])
      .mockResolvedValueOnce([]);

    await service.findAll();

    expect(prisma.reservation.updateMany).not.toHaveBeenCalled();
  });

  it('returns only active reservations with the fields used by the open tickets screen', async () => {
    const activeReservations = [
      {
        id: 12,
        name: 'Cliente',
        status: 'Pendente',
        tableId: 5,
        startsAtDate: new Date(),
        startsAtHours: new Date(),
        endsAtDate: new Date(),
        endsAtHours: new Date(),
      },
    ];
    prisma.reservation.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(activeReservations);

    await expect(service.findOpen()).resolves.toEqual(activeReservations);
    expect(prisma.reservation.findMany).toHaveBeenNthCalledWith(2, {
      where: { status: { in: ['Pendente', 'Confirmada'] } },
      select: {
        id: true,
        name: true,
        status: true,
        tableId: true,
        startsAtDate: true,
        startsAtHours: true,
        endsAtDate: true,
        endsAtHours: true,
      },
      orderBy: [{ startsAtDate: 'asc' }, { startsAtHours: 'asc' }],
    });
  });
});
