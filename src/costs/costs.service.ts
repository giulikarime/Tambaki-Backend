import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCostDto } from './create-costs.dto'
import { UpdateCostDto } from './update-costs.dto'

@Injectable()
export class CostsService {
  constructor(private prisma: PrismaService) { }

  create(dto: CreateCostDto) {
    return this.prisma.cost.create({
      data: {
        costCategory: dto.costCategory,
        costType: dto.costType,
        amount: dto.amount,
        date: dto.date,
      }
    })
  }

  findAll() {
    return this.prisma.cost.findMany()
  }

  findOne(id: number) {
    return this.prisma.cost.findUnique({ where: { id } })
  }

  findFixedCosts() {
    return this.prisma.cost.findMany({ where: { costType: 'Fixo' } })
  }

  findVariableCosts() {
    return this.prisma.cost.findMany({ where: { costType: 'Variavel' } })
  }

  async findTotals() {
    const [fixedCosts, variableCosts] = await Promise.all([
      this.prisma.cost.aggregate({
        where: { costType: 'Fixo' },
        _sum: { amount: true },
      }),
      this.prisma.cost.aggregate({
        where: { costType: 'Variavel' },
        _sum: { amount: true },
      }),
    ])

    const fixed = fixedCosts._sum.amount ?? 0
    const variable = variableCosts._sum.amount ?? 0

    return {
      fixed,
      variable,
      total: fixed + variable,
    }
  }

  update(id: number, updateCostDto: UpdateCostDto) {
    return this.prisma.cost.update({
      where: { id },
      data: updateCostDto,
    })
  }

  remove(id: number) {
    return this.prisma.cost.delete({ where: { id } })
  }
}