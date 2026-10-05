import { Prisma } from '../../generated/prisma/client';
import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { UnitOfMeasure } from '../../generated/prisma/enums';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) { }

  private getProductAlertState(product: {
    stock_quantity: number;
    min_stock: number;
    expiration_date: Date | string;
  }) {
    const today = new Date();
    const expirationDate = new Date(product.expiration_date);
    const daysLeft = Math.ceil(
      (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    const isExpired = expirationDate < today;
    const isExpiringSoon = expirationDate >= today && daysLeft <= 7;
    const isOutOfStock = product.stock_quantity === 0;
    const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.min_stock;

    const alerts: string[] = [];

    if (isExpired) alerts.push('vencido');
    if (isExpiringSoon) alerts.push('quase_vencendo');
    if (isOutOfStock) alerts.push('acabado');
    if (isLowStock) alerts.push('quase_acabando');

    return {
      alerts,
    };
  }

  private addProductAlerts<T extends {
    id: number;
    name: string;
    stock_quantity: number;
    min_stock: number;
    expiration_date: Date | string;
  }>(product: T) {
    const { alerts } = this.getProductAlertState(product);

    return {
      ...product,
      alerts,
    };
  }

  private async checkAndNotifyProductAlerts(product: {
    id: number;
    name: string;
    stock_quantity: number;
    min_stock: number;
    expiration_date: Date | string;
  }) {
    const { alerts } = this.getProductAlertState(product);
    const today = new Date();
    const expirationDate = new Date(product.expiration_date);
    const daysLeft = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const isExpired = expirationDate < today;
    const isExpiringSoon = expirationDate >= today && daysLeft <= 7;
    const isOutOfStock = product.stock_quantity === 0;
    const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.min_stock;

    const messages: Record<string, string> = {
      vencido: `Produto ${product.name} está vencido.`,
      quase_vencendo: `Produto ${product.name} está quase vencendo. Faltam ${daysLeft} dia(s) para vencer.`,
      acabado: `Produto ${product.name} acabou no estoque.`,
      quase_acabando: `Produto ${product.name} está acabando. Restam ${product.stock_quantity} unidade(s).`,
    };

    const notificationRules = [
      { key: 'vencido', active: isExpired },
      { key: 'quase_vencendo', active: isExpiringSoon },
      { key: 'acabado', active: isOutOfStock },
      { key: 'quase_acabando', active: isLowStock },
    ];

    for (const rule of notificationRules) {
      if (!rule.active || !alerts.includes(rule.key)) continue;

      await this.notificationsService.createIfNeeded({
        message: messages[rule.key],
        produtoID: product.id,
        read: false,
      });
    }
  }

  async create(dto: CreateProductDto) {
    const existingBatch = await this.prisma.product.findFirst({
      where: { batch: dto.batch },
    });
    if (existingBatch) {
      throw new ConflictException(
        "Já existe um lote cadastrado com esse valor.",
      )
    }

    const supplier = await this.prisma.supplier.findUnique({
      where: { id: dto.supplierId },
    });
    if (!supplier) {
      throw new NotFoundException('Fornecedor não encontrado.');
    }

    const unit = await this.prisma.storeUnit.findUnique({
      where: { id: dto.unitId },
    });
    if (!unit) {
      throw new NotFoundException('Unidade (loja) não encontrada.');
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        cost_price: dto.cost_price,
        category: dto.category,
        brand: dto.brand,
        allergens: dto.allergens,
        document_url: dto.document_url,
        stock_quantity: dto.stock_quantity,
        unit_of_product: dto.unit_of_product,
        measure_unit_of_product: dto.measure_unit_of_product,
        unit_of_measure: dto.unit_of_measure as UnitOfMeasure,
        min_stock: dto.min_stock,
        max_stock: dto.max_stock,
        manufacture_date: new Date(dto.manufacture_date),
        expiration_date: new Date(dto.expiration_date),
        storageLocation: dto.storageLocation,
        status: dto.status,
        batch: dto.batch,
        supplierId: dto.supplierId,
        unitId: dto.unitId,
      },
    });

    await this.checkAndNotifyProductAlerts(product);

    return {
      message: 'Produto cadastrado com sucesso!',
      product: this.addProductAlerts(product),
    };
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: { supplier: true, unit: true },
    });

    return products.map((product) => this.addProductAlerts(product));
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { supplier: true, unit: true },
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }
    return this.addProductAlerts(product);
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    if (dto.supplierId !== undefined) {
      const supplier = await this.prisma.supplier.findUnique({
        where: { id: dto.supplierId },
      });
      if (!supplier) {
        throw new NotFoundException('Fornecedor não encontrado.');
      }
    }

    if (dto.unitId !== undefined) {
      const unit = await this.prisma.storeUnit.findUnique({
        where: { id: dto.unitId },
      });
      if (!unit) {
        throw new NotFoundException('Unidade (loja) não encontrada.');
      }
    }

    const { manufacture_date, expiration_date, ...data } = dto;

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(manufacture_date && { manufacture_date: new Date(manufacture_date) }),
        ...(expiration_date && { expiration_date: new Date(expiration_date) }),
      } as Prisma.ProductUncheckedUpdateInput,
    });

    await this.checkAndNotifyProductAlerts(updatedProduct);

    return {
      message: 'Produto atualizado com sucesso!',
      product: this.addProductAlerts(updatedProduct),
    };
  }

  async delete(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    await this.prisma.product.delete({ where: { id } });

    return { message: 'Produto excluído com sucesso!' };
  }

  // products.service.ts
  async writeOff(id: number, quantity: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado.');

    if (!quantity || isNaN(quantity)) {
      throw new BadRequestException('Quantidade inválida.');
    }
    if (quantity <= 0) {
      throw new BadRequestException('A quantidade de baixa deve ser maior que zero.');
    }
    if (quantity > product.stock_quantity) {
      throw new BadRequestException('Quantidade de baixa maior que o estoque disponível.');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        stock_quantity: { decrement: quantity },
      },
    });

    await this.checkAndNotifyProductAlerts(updated);

    return {
      message: 'Baixa realizada com sucesso!',
      product: this.addProductAlerts(updated),
    };
  }

}