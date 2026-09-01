import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const existingProduct = await this.prisma.product.findFirst({
      where: { name: dto.name },
    });
    if (existingProduct) {
      throw new ConflictException(
        'Já existe um produto cadastrado com este nome.',
      );
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
        allergens: dto.allergens ?? [],
        stock_quantity: dto.stock_quantity,
        unit_of_measure: dto.unit_of_measure,
        current_stock: dto.current_stock,
        min_stock: dto.min_stock,
        manufacture_date: new Date(dto.manufacture_date),
        expiration_date: new Date(dto.expiration_date),
        available: dto.available ?? true,
        supplierId: dto.supplierId,
        unitId: dto.unitId,
      },
    });

    return {
      message: 'Produto cadastrado com sucesso!',
      product,
    };
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { supplier: true },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    if (dto.name !== undefined && dto.name !== product.name) {
      const existingProduct = await this.prisma.product.findFirst({
        where: { name: dto.name },
      });
      if (existingProduct) {
        throw new ConflictException(
          'Já existe um produto cadastrado com este nome.',
        );
      }
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
    
    // Separa as datas pra converter e mantém os outros campos do PATCH.
    const { manufacture_date, expiration_date, ...data } = dto;

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(manufacture_date && { manufacture_date: new Date(manufacture_date) }),
        ...(expiration_date && { expiration_date: new Date(expiration_date) }),
      },
    });

    return {
      message: 'Produto atualizado com sucesso!',
      product: updatedProduct,
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
}