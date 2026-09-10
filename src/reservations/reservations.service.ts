import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './create-reservation.dto';
import { UpdateReservationDto } from './update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  private splitDateTime(value: Date) {
    return {
      date: new Date(value.getFullYear(), value.getMonth(), value.getDate()),
      time: value,
    };
  }

  private combineDateTime(date: Date, time: Date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds(),
    );
  }

  async create(dto: CreateReservationDto) {
    const table = await this.prisma.table.findUnique({ where: { id: dto.tableId } });
    if (!table) {
      throw new NotFoundException('Mesa não encontrada.');
    }

    const startsAt = this.combineDateTime(new Date(dto.startsAtDate), new Date(dto.startsAtHours));
    const endsAt = this.combineDateTime(new Date(dto.endsAtDate), new Date(dto.endsAtHours));
    const startsAtParts = this.splitDateTime(startsAt);
    const endsAtParts = this.splitDateTime(endsAt);

    if (endsAt <= startsAt) {
      throw new BadRequestException('O horário final precisa ser depois do horário inicial.');
    }

    if (dto.quantityPeople > table.capacity) {
      throw new BadRequestException(
        `Essa mesa comporta no máximo ${table.capacity} pessoa(s).`,
      );
    }

    const reservations = await this.prisma.reservation.findMany({
      where: { tableId: dto.tableId, status: { not: 'Cancelada' } },
    });
    const overlapping = reservations.find((reservation) => {
      const reservationStartsAt = this.combineDateTime(
        reservation.startsAtDate,
        reservation.startsAtHours,
      );
      const reservationEndsAt = this.combineDateTime(
        reservation.endsAtDate,
        reservation.endsAtHours,
      );
      return reservationStartsAt < endsAt && reservationEndsAt > startsAt;
    });


    if (overlapping) {
      throw new BadRequestException('Essa mesa já está reservada nesse período.');
    }

    const reservation = await this.prisma.reservation.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        quantityPeople: dto.quantityPeople,
        startsAtDate: startsAtParts.date,
        startsAtHours: startsAtParts.time,
        endsAtDate: endsAtParts.date,
        endsAtHours: endsAtParts.time,
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

    const startsAt = (dto.startsAtDate && dto.startsAtHours)
  ? this.combineDateTime(new Date(dto.startsAtDate), new Date(dto.startsAtHours))
  : this.combineDateTime(reservation.startsAtDate, reservation.startsAtHours);

const endsAt = (dto.endsAtDate && dto.endsAtHours)
  ? this.combineDateTime(new Date(dto.endsAtDate), new Date(dto.endsAtHours))
  : this.combineDateTime(reservation.endsAtDate, reservation.endsAtHours);

    const startsAtParts = this.splitDateTime(startsAt);
    const endsAtParts = this.splitDateTime(endsAt);

    if (endsAt <= startsAt) {
      throw new BadRequestException('O horário final precisa ser depois do horário inicial.');
    }

    const quantityPeople = dto.quantityPeople ?? reservation.quantityPeople;
    if (quantityPeople > table.capacity) {
      throw new BadRequestException(
        `Essa mesa comporta no máximo ${table.capacity} pessoa(s).`,
      );
    }

    const reservations = await this.prisma.reservation.findMany({
      where: { id: { not: id }, tableId, status: { not: 'Cancelada' } },
    });
    const overlapping = reservations.find((item) => {
      const itemStartsAt = this.combineDateTime(item.startsAtDate, item.startsAtHours);
      const itemEndsAt = this.combineDateTime(item.endsAtDate, item.endsAtHours);
      return itemStartsAt < endsAt && itemEndsAt > startsAt;
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
        startsAtDate: startsAtParts.date,
        startsAtHours: startsAtParts.time,
        endsAtDate: endsAtParts.date,
        endsAtHours: endsAtParts.time,
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