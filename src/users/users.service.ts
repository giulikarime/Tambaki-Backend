import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './register-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './update-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async registerUser(dto: RegisterUserDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { cpf: dto.cpf }],
      },
    });
    if (existing) {
      throw new ConflictException('Já existe um usuário com esse e-mail ou CPF.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        cpf: dto.cpf,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: dto.role,
        acess_level: dto.acess_level,
        employ_type: dto.employ_type,
        shift: dto.shift,
        hire_date: dto.hire_date ? new Date(dto.hire_date) : undefined,
        weekly_hours: dto.weekly_hours,
        salary: dto.salary,
        bankName: dto.bankName,
        active: dto.active,
        storeUnitId: dto.storeUnitId,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      message: 'Usuário cadastrado com sucesso!',
      user: userWithoutPassword,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: { storeUnit: true },
    });

    return users.map(({ password: _, ...user }) => user);
  }

  async update(id: number, dto: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        cpf: dto.cpf,
        email: dto.email,
        phone: dto.phone,
        password: dto.password ? await bcrypt.hash(dto.password, SALT_ROUNDS) : undefined,
        role: dto.role,
        acess_level: dto.acess_level,
        employ_type: dto.employ_type,
        shift: dto.shift,
        hire_date: dto.hire_date ? new Date(dto.hire_date) : undefined,
        weekly_hours: dto.weekly_hours,
        salary: dto.salary,
        bankName: dto.bankName,
        active: dto.active,
        storeUnitId: dto.storeUnitId,
      },
    });

    const { password: _, ...userWithoutPassword } = updated;
    return {
      message: 'Usuário atualizado com sucesso!',
      user: userWithoutPassword,
    };
  }

  async delete(id: number) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: 'Usuário deletado com sucesso!',
    };
  }
}
