import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './create-unit.dto';
import { UpdateUnitDto } from './update-unit.dto';

@Injectable()
export class UnitService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUnitDto) {
    const unit = await this.prisma.storeUnit.create({
      data: {
        company_name: dto.company_name,
        trade_name: dto.trade_name,
        cnpj: dto.cnpj,
        adress: dto.adress,
        email: dto.email,
        phone: dto.phone,
      },
    });

    return { message: 'Unidade cadastrada com sucesso!', unit };
  }

  async findAll() {
    return this.prisma.storeUnit.findMany();
  }

  async findOne(id: number) {
    const unit = await this.prisma.storeUnit.findUnique({ where: { id } });
    if (!unit) {
      throw new NotFoundException('Unidade não encontrada.');
    }
    return unit;
  }

  async update(id: number, dto: UpdateUnitDto) {
    const unit = await this.prisma.storeUnit.findUnique({ where: { id } });
    if (!unit) {
      throw new NotFoundException('Unidade não encontrada.');
    }

    const updated = await this.prisma.storeUnit.update({
      where: { id },
      data: dto,
    });

    return { message: 'Unidade atualizada com sucesso!', unit: updated };
  }

  async delete(id: number) {
    const unit = await this.prisma.storeUnit.findUnique({ where: { id } });
    if (!unit) {
      throw new NotFoundException('Unidade não encontrada.');
    }

    const [users, products, menus, tables, reservations, orders] = await Promise.all([
      this.prisma.user.count({ where: { storeUnitId: id } }),
      this.prisma.product.count({ where: { unitId: id } }),
      this.prisma.menu.count({ where: { unitId: id } }),
      this.prisma.table.count({ where: { unitId: id } }),
      this.prisma.reservation.count({ where: { unitId: id } }),
      this.prisma.order.count({ where: { unitId: id } }),
    ]);

    if (users > 0 || products > 0 || menus > 0 || tables > 0 || reservations > 0 || orders > 0) {
      throw new BadRequestException(
        'Não é possível excluir esta unidade porque ela possui usuários, produtos, mesas, reservas, pedidos ou itens do cardápio vinculados.',
      );
    }

    await this.prisma.storeUnit.delete({ where: { id } });

    return { message: 'Unidade removida com sucesso!' };
  }
}