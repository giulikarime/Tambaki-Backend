import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './create-menu.dto';
import { UpdateMenuDto } from './update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMenuDto) {
    const unit = await this.prisma.storeUnit.findUnique({ where: { id: dto.unitId } });
    if (!unit) {
      throw new NotFoundException('Unidade não encontrada.');
    }

    const menuItem = await this.prisma.menu.create({
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.category,
        price: dto.price,
        available: dto.available,
        unitId: dto.unitId,
      },
    });

    return { message: 'Item do cardápio criado com sucesso!', menuItem };
  }

  async findAll() {
    return this.prisma.menu.findMany();
  }

  async findOne(id: number) {
    const menuItem = await this.prisma.menu.findUnique({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException('Item do cardápio não encontrado.');
    }
    return menuItem;
  }

  async update(id: number, dto: UpdateMenuDto) {
    const menuItem = await this.prisma.menu.findUnique({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException('Item do cardápio não encontrado.');
    }

    const updated = await this.prisma.menu.update({
      where: { id },
      data: dto,
    });

    return { message: 'Item do cardápio atualizado com sucesso!', menuItem: updated };
  }

  async remove(id: number) {
    const menuItem = await this.prisma.menu.findUnique({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException('Item do cardápio não encontrado.');
    }

    await this.prisma.menu.delete({ where: { id } });

    return { message: 'Item do cardápio excluído com sucesso!' };
  }
}