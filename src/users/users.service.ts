import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './register-user.dto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: { storeUnit: true },
    });

    return users.map(({ password: _, ...user }) => user);
  }

    async registerUser(dto: RegisterUserDto) {
      const existing = await this.prisma.client.findFirst({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('Já existe uma conta com esse e-mail.');
      }
  
      const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
  
      const users = await this.prisma.client.create({
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          password: hashedPassword,
          acess_level: dto.acess_level,
          employ_type: dto.employ_type,
          shift: dto.shift,
          hire_date: dto.hire_date,
          weekly_hours: dto.weekly_hours,
          salary: dto.salary,
          bankName: dto.bankName,
          storeUnitId: dto.storeUnitId,
        },
      });
  
      const { password: _, ...usersWithoutPassword } = users;
      return {
        message: 'Usuário cadastrado com sucesso!',
        user: usersWithoutPassword,
      };
    }
  
}
