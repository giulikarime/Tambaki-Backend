import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './create-reservation.dto';
import { UpdateReservationDto } from './update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReservationDto) {
    const table = await this.prisma.table.findUnique({ where: { id: dto.tableId } });
    if (!table) {
      throw new NotFoundException('Mesa não encontrada.');
    }

    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);

    if (endsAt <= startsAt) {
      throw new BadRequestException('endsAt precisa ser depois de startsAt.');
    }

    if (dto.quantityPeople > table.capacity) {
      throw new BadRequestException(
        `Essa mesa comporta no máximo ${table.capacity} pessoa(s).`,
      );
    }

    // procura reserva já existente que se sobreponha ao horário pedido, pra essa mesma mesa
    const overlapping = await this.prisma.reservation.findFirst({
      where: {
        tableId: dto.tableId,
        status: { not: 'Cancelada' },
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
    });

    if (overlapping) {
      throw new BadRequestException('Essa mesa já está reservada nesse período.');
    }

    const reservation = await this.prisma.reservation.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        quantityPeople: dto.quantityPeople,
        startsAt,
        endsAt,
        tableId: table.id,
        unitId: table.unitId,
      },
    });

    return { message: 'Reserva criada com sucesso!', reservation };
  }

  async findAll() {
    return this.prisma.reservation.findMany({
      include: { table: true },
      orderBy: { startsAt: 'asc' },
    });
  }

  async findOne(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { table: true },
    });

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada.');
    }

    return reservation;
  }

  async update(id: number, dto: UpdateReservationDto) {
    const reservation = await this.prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada.');
    }

    const tableId = dto.tableId ?? reservation.tableId;
    const table = await this.prisma.table.findUnique({ where: { id: tableId } });
    if (!table) {
      throw new NotFoundException('Mesa não encontrada.');
    }

    const startsAt = dto.startsAt ? new Date(dto.startsAt) : reservation.startsAt;
    const endsAt = dto.endsAt ? new Date(dto.endsAt) : reservation.endsAt;
    if (endsAt <= startsAt) {
      throw new BadRequestException('endsAt precisa ser depois de startsAt.');
    }

    const quantityPeople = dto.quantityPeople ?? reservation.quantityPeople;
    if (quantityPeople > table.capacity) {
      throw new BadRequestException(
        `Essa mesa comporta no máximo ${table.capacity} pessoa(s).`,
      );
    }

    const overlapping = await this.prisma.reservation.findFirst({
      where: {
        id: { not: id },
        tableId,
        status: { not: 'Cancelada' },
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
    });
    if (overlapping) {
      throw new BadRequestException('Essa mesa já está reservada nesse período.');
    }

    const updated = await this.prisma.reservation.update({
      where: { id },
      data: {
        name: dto.name,
        phone: dto.phone,
        quantityPeople,
        startsAt,
        endsAt,
        status: dto.status,
        ...(dto.tableId !== undefined ? { tableId, unitId: table.unitId } : {}),
      },
      include: { table: true },
    });

    return { message: 'Reserva atualizada com sucesso!', reservation: updated };
  }

  async delete(id: number) {
    const reservation = await this.prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada.');
    }

    await this.prisma.reservation.delete({ where: { id } });
    return { message: 'Reserva excluída com sucesso!' };
  }

  async cancel(id: number) {
    const reservation = await this.prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada.');
    }
    if (reservation.status === 'Cancelada') {
      throw new BadRequestException('Essa reserva já está cancelada.');
    }

    const updated = await this.prisma.reservation.update({
      where: { id },
      data: { status: 'Cancelada' },
    });

    return { message: 'Reserva cancelada com sucesso!', reservation: updated };
  }
}