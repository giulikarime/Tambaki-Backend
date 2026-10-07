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
        name: dto.name,
        costCategory: dto.costCategory,
        costType: dto.costType,
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