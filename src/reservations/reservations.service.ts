import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './create-reservation.dto';
import { UpdateReservationDto } from './update-reservation.dto';
import {
  combineReservationDateTime,
  RESERVATION_LATE_GRACE_PERIOD_MS,
} from './reservation-time';

@Injectable()
export class ReservationsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReservationsService.name);
  private expirationTimer?: ReturnType<typeof setInterval>;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    void this.runExpirationCheck();
    this.expirationTimer = setInterval(
      () => void this.runExpirationCheck(),
      30_000,
    );
  }

  onModuleDestroy() {
    if (this.expirationTimer) {
      clearInterval(this.expirationTimer);
    }
  }

  private async cancelOverduePendingReservations() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingReservations = await this.prisma.reservation.findMany({
      where: {
        status: 'Pendente',
        startsAtDate: { lte: today },
      },
      select: { id: true, startsAtDate: true, startsAtHours: true },
    });
    const now = Date.now();
    const overdueIds = pendingReservations
      .filter((reservation) => {
        const startsAt = combineReservationDateTime(
          reservation.startsAtDate,
          reservation.startsAtHours,
        );
        return startsAt.getTime() + RESERVATION_LATE_GRACE_PERIOD_MS <= now;
      })
      .map((reservation) => reservation.id);

    if (!overdueIds.length) return;

    await this.prisma.reservation.updateMany({
      where: { id: { in: overdueIds }, status: 'Pendente' },
      data: { status: 'Cancelada' },
    });
  }

  private async runExpirationCheck() {
    try {
      await this.cancelOverduePendingReservations();
    } catch (error) {
      this.logger.error(
        'Falha ao cancelar reservas pendentes após o limite de atraso.',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private splitDateTime(value: Date) {
    return {
      date: new Date(value.getFullYear(), value.getMonth(), value.getDate()),
      time: value,
    };
  }

  async create(dto: CreateReservationDto) {
    await this.cancelOverduePendingReservations();
    const table = await this.prisma.table.findUnique({ where: { id: dto.tableId } });
    if (!table) {
      throw new NotFoundException('Mesa não encontrada.');
    }

    const startsAt = combineReservationDateTime(new Date(dto.startsAtDate), new Date(dto.startsAtHours));
    const endsAt = combineReservationDateTime(new Date(dto.endsAtDate), new Date(dto.endsAtHours));
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
      where: { tableId: dto.tableId, status: { in: ['Pendente', 'Confirmada'] } },
    });
    const overlapping = reservations.find((reservation) => {
      const reservationStartsAt = combineReservationDateTime(
        reservation.startsAtDate,
        reservation.startsAtHours,
      );
      const reservationEndsAt = combineReservationDateTime(
        reservation.endsAtDate,
        reservation.endsAtHours,
      );
      return reservationStartsAt < endsAt && reservationEndsAt > startsAt;
    });


    if (overlapping) {
      throw new BadRequestException('Este horário já está reservado');
    }

    const reservation = await this.prisma.reservation.create({
      data: {
        name: dto.name,
        phone: dto.phone ?? '',
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
    await this.cancelOverduePendingReservations();
    return this.prisma.reservation.findMany({
      include: { table: true },
      orderBy: [{ startsAtDate: 'asc' }, { startsAtHours: 'asc' }],
    });
  }

  async findOpen() {
    await this.cancelOverduePendingReservations();
    return this.prisma.reservation.findMany({
      where: { status: { in: ['Pendente', 'Confirmada'] } },
      select: {
        id: true,
        name: true,
        status: true,
        tableId: true,
        startsAtDate: true,
        startsAtHours: true,
        endsAtDate: true,
        endsAtHours: true,
      },
      orderBy: [{ startsAtDate: 'asc' }, { startsAtHours: 'asc' }],
    });
  }

  async findOne(id: number) {
    await this.cancelOverduePendingReservations();
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
    await this.cancelOverduePendingReservations();
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
  ? combineReservationDateTime(new Date(dto.startsAtDate), new Date(dto.startsAtHours))
  : combineReservationDateTime(reservation.startsAtDate, reservation.startsAtHours);

const endsAt = (dto.endsAtDate && dto.endsAtHours)
  ? combineReservationDateTime(new Date(dto.endsAtDate), new Date(dto.endsAtHours))
  : combineReservationDateTime(reservation.endsAtDate, reservation.endsAtHours);

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
      where: {
        id: { not: id },
        tableId,
        status: { in: ['Pendente', 'Confirmada'] },
      },
    });
    const overlapping = reservations.find((item) => {
      const itemStartsAt = combineReservationDateTime(item.startsAtDate, item.startsAtHours);
      const itemEndsAt = combineReservationDateTime(item.endsAtDate, item.endsAtHours);
      return itemStartsAt < endsAt && itemEndsAt > startsAt;
    });

    if (overlapping) {
      throw new BadRequestException('Este horário já está reservado');
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