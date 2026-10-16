import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCmvEntryDto } from './create-cmv-entry.dto';
import { CmvQueryDto } from './cmv-query.dto';

@Injectable()
export class CmvService {
  constructor(private readonly prisma: PrismaService) {}

  private round(value: number) {
    return Math.round(value * 100) / 100;
  }

  private buildWhere(
    query: CmvQueryDto,
    start: Date,
    end: Date,
  ): Prisma.CmvEntryWhereInput {
    const productFilter: Prisma.ProductWhereInput = {};

    if (query.category) {
      productFilter.category = query.category;
    }

    if (query.leadTimeMin !== undefined || query.leadTimeMax !== undefined) {
      productFilter.supplier = {
        lead_time_days: { gte: query.leadTimeMin, lte: query.leadTimeMax },
      };
    }

    const hasProductFilter = Object.keys(productFilter).length > 0;

    return {
      unitId: query.unitId,
      date: { gte: start, lt: end },
      ...(hasProductFilter ? { product: { is: productFilter } } : {}),
    };
  }

  private getMonthRange(month: number, year: number) {
    return {
      start: new Date(Date.UTC(year, month - 1, 1)),
      end: new Date(Date.UTC(year, month, 1)),
      prevStart: new Date(Date.UTC(year, month - 2, 1)),
    };
  }

  async create(dto: CreateCmvEntryDto) {
    const unit = await this.prisma.storeUnit.findUnique({
      where: { id: dto.unitId },
    });
    if (!unit) {
      throw new NotFoundException('Unidade (loja) não encontrada.');
    }

    if (dto.productId !== undefined) {
      const product = await this.prisma.product.findUnique({
        where: { id: dto.productId },
      });
      if (!product) {
        throw new NotFoundException('Produto não encontrado.');
      }
    }

    const entry = await this.prisma.cmvEntry.create({
      data: {
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        date: new Date(dto.date),
        unitId: dto.unitId,
        productId: dto.productId,
      },
    });

    return { message: 'Gasto de CMV registrado com sucesso!', entry };
  }

  async findAll(query: CmvQueryDto) {
    const { start, end } = this.getMonthRange(query.month, query.year);

    return this.prisma.cmvEntry.findMany({
      where: this.buildWhere(query, start, end),
      include: { product: { select: { name: true, category: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async summary(query: CmvQueryDto) {
    const { start, end, prevStart } = this.getMonthRange(query.month, query.year);

    const entries = await this.prisma.cmvEntry.findMany({
      where: this.buildWhere(query, start, end),
      include: { product: { select: { category: true } } },
    });

    const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    for (const entry of entries) {
      byType[entry.type] = this.round((byType[entry.type] ?? 0) + entry.amount);

      if (entry.product) {
        const category = entry.product.category;
        byCategory[category] = this.round((byCategory[category] ?? 0) + entry.amount);
      }
    }

    const previous = await this.prisma.cmvEntry.aggregate({
      where: this.buildWhere(query, prevStart, start),
      _sum: { amount: true },
    });
    const previousTotal = previous._sum.amount ?? 0;

    const variationPercent =
      previousTotal > 0
        ? this.round(((total - previousTotal) / previousTotal) * 100)
        : null;

    return {
      month: query.month,
      year: query.year,
      total: this.round(total),
      previousTotal: this.round(previousTotal),
      variationPercent,
      byType,
      byCategory,
    };
  }
}