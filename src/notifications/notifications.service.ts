import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationsDto } from './create-notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async hasRecentNotification(productId: number, message: string) {
    const limitDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const existing = await this.prisma.notification.findFirst({
      where: {
        produtoID: productId,
        message,
        createdAt: {
          gte: limitDate,
        },
      },
    });

    return !!existing;
  }

  async create(dto: CreateNotificationsDto) {
    if (dto.produtoID !== undefined) {
      const product = await this.prisma.product.findUnique({
        where: { id: dto.produtoID },
      });

      if (!product) {
        throw new NotFoundException('Produto não encontrado.');
      }
    }

    const notification = await this.prisma.notification.create({
      data: {
        message: dto.message,
        read: dto.read ?? false,
        ...(dto.produtoID !== undefined && { produtoID: dto.produtoID }),
      },
      include: { product: true },
    });

    return {
      message: 'Notificação criada com sucesso!',
      notification,
    };
  }

  async createIfNeeded(dto: CreateNotificationsDto) {
    if (dto.produtoID === undefined) {
      return this.create(dto);
    }

    const alreadyExists = await this.hasRecentNotification(dto.produtoID, dto.message);
    if (alreadyExists) {
      return {
        message: 'Notificação já registrada recentemente.',
        notification: null,
      };
    }

    return this.create(dto);
  }

  async findAll() {
    return this.prisma.notification.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada.');
    }

    return notification;
  }

  async markAsRead(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada.');
    }

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { read: true },
      include: { product: true },
    });

    return {
      message: 'Notificação marcada como lida.',
      notification: updated,
    };
  }

  async remove(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada.');
    }

    await this.prisma.notification.delete({ where: { id } });

    return { message: 'Notificação removida com sucesso!' };
  }
}
