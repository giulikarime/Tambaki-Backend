import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterSupplierDto } from "./register-supplier.dto";
import { UpdateSupplierDto } from "./update-supplier.dto";

@Injectable()
export class SuppliersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: RegisterSupplierDto) {
        const existingSupplier = await this.prisma.supplier.findFirst({
            where: {
                OR: [
                    { cnpj: dto.cnpj },
                    { email: dto.email },
                    { company_name: dto.company_name },
                ],
            },
        });
        if (existingSupplier) {
            throw new ConflictException(
                'Já existe um fornecedor cadastrado com esse CNPJ, E-mail ou Nome.',
            );
        }

        const supplier = await this.prisma.supplier.create({
            data: dto,
        });

        return {
            message: 'Fornecedor cadastrado com sucesso!',
            supplier,
        };
    }

    async findAll() {
        return this.prisma.supplier.findMany();
    }

    async findOne(id: number) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { id },
        });
        if (!supplier) {
            throw new NotFoundException('Fornecedor não encontrado');
        }
        return supplier;
    }

    async update(id: number, dto: UpdateSupplierDto) {
        const supplier = await this.prisma.supplier.findUnique({ where: { id } });
        if (!supplier) {
            throw new NotFoundException('Fornecedor não encontrado');
        }

        const duplicateConditions = [
            dto.cnpj !== undefined ? { cnpj: dto.cnpj } : undefined,
            dto.email !== undefined ? { email: dto.email } : undefined,
            dto.company_name !== undefined ? { company_name: dto.company_name } : undefined,
        ].filter((condition) => condition !== undefined);

        if (duplicateConditions.length > 0) {
            const existingSupplier = await this.prisma.supplier.findFirst({
                where: {
                    id: { not: id },
                    OR: duplicateConditions,
                },
            });
            if (existingSupplier) {
                throw new ConflictException(
                    'Já existe um fornecedor cadastrado com esse CNPJ, E-mail ou Nome.',
                );
            }
        }

        const updatedSupplier = await this.prisma.supplier.update({
            where: { id },
            data: dto,
        });
        return {
            message: 'Fornecedor atualizado com sucesso!',
            supplier: updatedSupplier,
        };
    }

    async delete(id: number) {
        const supplier = await this.prisma.supplier.findUnique({ where: { id } });
        if (!supplier) {
            throw new NotFoundException('Fornecedor não encontrado');
        }

        const productsCount = await this.prisma.product.count({
            where: { supplierId: id },
        });
        if (productsCount > 0) {
            throw new ConflictException(
                'Não é possível excluir este fornecedor pois existem produtos associados a ele.',
            );
        }

        await this.prisma.supplier.delete({ where: { id } });
        return {
            message: 'Fornecedor excluído com sucesso!',
        };
    }
}