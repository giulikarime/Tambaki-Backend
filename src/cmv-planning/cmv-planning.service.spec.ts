import type { PrismaService } from '../prisma/prisma.service';
import { CmvPlanningService } from './cmv-planning.service';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('CmvPlanningService', () => {
  const prisma = {
    user: {
      findUnique: jest.fn().mockResolvedValue({ storeUnitId: 7 }),
    },
    cmvPlanning: {
      findMany: jest.fn().mockResolvedValue([]),
      upsert: jest.fn().mockResolvedValue({ id: 1 }),
    },
  };
  const service = new CmvPlanningService(prisma as unknown as PrismaService);

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.user.findUnique.mockResolvedValue({ storeUnitId: 7 });
    prisma.cmvPlanning.findMany.mockResolvedValue([]);
    prisma.cmvPlanning.upsert.mockResolvedValue({ id: 1 });
  });

  it('lists plans for the authenticated user unit and requested year', async () => {
    await service.findForUser(3, 2026);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 3 },
      select: { storeUnitId: true },
    });
    expect(prisma.cmvPlanning.findMany).toHaveBeenCalledWith({
      where: { unitId: 7, year: 2026 },
      orderBy: { month: 'asc' },
    });
  });

  it('upserts the monthly amount within the authenticated user unit', async () => {
    await service.saveForUser(3, {
      year: 2026,
      month: 11,
      plannedAmount: 12500.5,
    });

    expect(prisma.cmvPlanning.upsert).toHaveBeenCalledWith({
      where: { unitId_year_month: { unitId: 7, year: 2026, month: 11 } },
      create: { unitId: 7, year: 2026, month: 11, plannedAmount: 12500.5 },
      update: { plannedAmount: 12500.5 },
    });
  });
});
