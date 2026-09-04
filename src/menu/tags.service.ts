import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './create-tag.dto';
import { UpdateTagDto } from './update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTagDto) {
    const existingTag = await this.prisma.tag.findUnique({ where: { name: dto.name } });
    if (existingTag) {
      throw new ConflictException('Já existe uma tag com esse nome.');
    }

    const tag = await this.prisma.tag.create({ data: dto });
    return { message: 'Tag criada com sucesso!', tag };
  }

  async findAll() {
    return this.prisma.tag.findMany();
  }

  async update(id: number, dto: UpdateTagDto) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag não encontrada.');
    }
    const updated = await this.prisma.tag.update({ where: { id }, data: dto });
    return { message: 'Tag atualizada com sucesso!', tag: updated };
  }

  async remove(id: number) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag não encontrada.');
    }
    await this.prisma.tag.delete({ where: { id } });
    return { message: 'Tag excluída com sucesso!' };
  }
}