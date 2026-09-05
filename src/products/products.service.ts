import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { Prisma } from '../../generated/prisma/client';

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

    const existingBatch = await this.prisma.product.findFirst({
      where:{batch : dto.batch},
    });
    if(existingBatch){
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
      data: dto
    });

    return {
      message: 'Produto cadastrado com sucesso!',
      product,
    };
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { supplier: true, unit: true },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { supplier: true, unit: true },
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }
    return product;
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

  const { manufacture_date, expiration_date, ...data } = dto;

  const updatedProduct = await this.prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(manufacture_date && { manufacture_date: new Date(manufacture_date) }),
      ...(expiration_date && { expiration_date: new Date(expiration_date) }),
    } as Prisma.ProductUncheckedUpdateInput,
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