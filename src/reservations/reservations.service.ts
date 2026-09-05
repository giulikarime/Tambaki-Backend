import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './create-reservation.dto';
import { UpdateReservationDto } from './update-reservation.dto';

function combineDateAndTime(date: Date, time: Date): Date {
  const combined = new Date(date);
  combined.setUTCHours(time.getUTCHours(), time.getUTCMinutes(), time.getUTCSeconds(), 0);
  return combined;
}

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReservationDto) {
    const table = await this.prisma.table.findUnique({ where: { id: dto.tableId } });
    if (!table) {
      throw new NotFoundException('Mesa não encontrada.');
    }

    const startsAtDate = new Date(dto.startsAtDate);
    const startsAtHours = new Date(dto.startsAtHours);
    const endsAtDate = new Date(dto.endsAtDate);
    const endsAtHours = new Date(dto.endsAtHours);

    const startsAt = combineDateAndTime(startsAtDate, startsAtHours);
    const endsAt = combineDateAndTime(endsAtDate, endsAtHours);

    if (endsAt <= startsAt) {
      throw new BadRequestException('O horário final precisa ser depois do horário inicial.');
    }

    if (dto.quantityPeople > table.capacity) {
      throw new BadRequestException(
        `Essa mesa comporta no máximo ${table.capacity} pessoa(s).`,
      );
    }

    // pré-filtra candidatos pelo intervalo de datas (rápido, feito no banco),
    // depois confirma a sobreposição exata combinando data+hora no JS
    const candidates = await this.prisma.reservation.findMany({
      where: {
        tableId: dto.tableId,
        status: { not: 'Cancelada' },
        startsAtDate: { lte: endsAtDate },
        endsAtDate: { gte: startsAtDate },
      },
    });

    const overlapping = candidates.some((r) => {
      const rStart = combineDateAndTime(r.startsAtDate, r.startsAtHours);
      const rEnd = combineDateAndTime(r.endsAtDate, r.endsAtHours);
      return rStart < endsAt && rEnd > startsAt;
    });

    if (overlapping) {
      throw new BadRequestException('Essa mesa já está reservada nesse período.');
    }

    const reservation = await this.prisma.reservation.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        quantityPeople: dto.quantityPeople,
        startsAtDate,
        startsAtHours,
        endsAtDate,
        endsAtHours,
        tableId: table.id,
        unitId: table.unitId,
      },
    });

    return { message: 'Reserva criada com sucesso!', reservation };
  }

  async findAll() {
    return this.prisma.reservation.findMany({
      include: { table: true },
      orderBy: [{ startsAtDate: 'asc' }, { startsAtHours: 'asc' }],
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

    const startsAtDate = dto.startsAtDate ? new Date(dto.startsAtDate) : reservation.startsAtDate;
    const startsAtHours = dto.startsAtHours ? new Date(dto.startsAtHours) : reservation.startsAtHours;
    const endsAtDate = dto.endsAtDate ? new Date(dto.endsAtDate) : reservation.endsAtDate;
    const endsAtHours = dto.endsAtHours ? new Date(dto.endsAtHours) : reservation.endsAtHours;

    const startsAt = combineDateAndTime(startsAtDate, startsAtHours);
    const endsAt = combineDateAndTime(endsAtDate, endsAtHours);

    if (endsAt <= startsAt) {
      throw new BadRequestException('O horário final precisa ser depois do horário inicial.');
    }

    const quantityPeople = dto.quantityPeople ?? reservation.quantityPeople;
    if (quantityPeople > table.capacity) {
      throw new BadRequestException(
        `Essa mesa comporta no máximo ${table.capacity} pessoa(s).`,
      );
    }

    const candidates = await this.prisma.reservation.findMany({
      where: {
        id: { not: id },
        tableId,
        status: { not: 'Cancelada' },
        startsAtDate: { lte: endsAtDate },
        endsAtDate: { gte: startsAtDate },
      },
    });

    const overlapping = candidates.some((r) => {
      const rStart = combineDateAndTime(r.startsAtDate, r.startsAtHours);
      const rEnd = combineDateAndTime(r.endsAtDate, r.endsAtHours);
      return rStart < endsAt && rEnd > startsAt;
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
        startsAtDate,
        startsAtHours,
        endsAtDate,
        endsAtHours,
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