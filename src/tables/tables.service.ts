import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './create-table.dto';
import { UpdateTableDto } from './update-table.dto';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTableDto) {
    const table = await this.prisma.table.create({
      data: {
        table_number: dto.table_number,
        capacity: dto.capacity,
        status: dto.status,
        unitId: dto.unitId,
      },
    });

    return {
      message: 'Mesa cadastrada com sucesso!',
      table,
    };
  }

  async findAll() {
    return this.prisma.table.findMany({
      include: { unit: true },
    });
  }

  async findOne(id: number) {
    const table = await this.prisma.table.findUnique({
      where: { id },
      include: { unit: true },
    });

    if (!table) {
      throw new NotFoundException('Mesa não encontrada.');
    }

    return table;
  }

  async update(id: number, dto: UpdateTableDto) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) {
      throw new NotFoundException('Mesa não encontrada.');
    }

    const updatedTable = await this.prisma.table.update({
      where: { id },
      data: dto,
    });

    return {
      message: 'Mesa atualizada com sucesso!',
      table: updatedTable,
    };
  }

  async remove(id: number) {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) {
      throw new NotFoundException('Mesa não encontrada.');
    }

    await this.prisma.table.delete({ where: { id } });

    return { message: 'Mesa excluída com sucesso!' };
  }
}