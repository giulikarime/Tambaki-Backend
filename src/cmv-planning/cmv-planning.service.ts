import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCmvPlanningDto } from './create-cmv-planning.dto';

@Injectable()
export class CmvPlanningService {
  constructor(private readonly prisma: PrismaService) {}

  async findForUser(userId: number, year: number) {
    const unitId = await this.getUnitId(userId);

    return this.prisma.cmvPlanning.findMany({
      where: { unitId, year },
      orderBy: { month: 'asc' },
    });
  }

  async saveForUser(userId: number, dto: CreateCmvPlanningDto) {
    const unitId = await this.getUnitId(userId);

    return this.prisma.cmvPlanning.upsert({
      where: {
        unitId_year_month: {
          unitId,
          year: dto.year,
          month: dto.month,
        },
      },
      create: {
        unitId,
        year: dto.year,
        month: dto.month,
        plannedAmount: dto.plannedAmount,
      },
      update: { plannedAmount: dto.plannedAmount },
    });
  }

  private async getUnitId(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { storeUnitId: true },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user.storeUnitId;
  }
}
