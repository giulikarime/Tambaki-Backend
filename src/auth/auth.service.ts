import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './login.dto';
import { RegisterClientDto } from './register-client.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerClient(dto: RegisterClientDto) {
    const existing = await this.prisma.client.findFirst({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Já existe uma conta com esse e-mail.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const client = await this.prisma.client.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        restaurant: dto.restaurant,
        password: hashedPassword,
        acess_level: dto.acess_level,
        status: dto.status,
      },
    });

    const { password: _, ...clientWithoutPassword } = client;
    return {
      message: 'Cliente cadastrado com sucesso!',
      client: clientWithoutPassword,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. Tenta autenticar como User (funcionário vinculado a uma unidade)
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (user) {
      return this.authenticateUser(user, password);
    }

    // 2. Se não achou User, tenta autenticar como Client (dono/admin da conta)
    const client = await this.prisma.client.findFirst({ where: { email } });
    if (client) {
      return this.authenticateClient(client, password);
    }

    // 3. Nenhum dos dois encontrado
    throw new UnauthorizedException('E-mail ou senha inválidos');
  }

  private async authenticateUser(
    user: NonNullable<
      Awaited<ReturnType<PrismaService['user']['findFirst']>>
    >,
    password: string,
  ) {
    if (!user.active) {
      throw new UnauthorizedException(
        'Usuário inativo. Contate o administrador.',
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload = {
      sub: user.id,
      type: 'user' as const,
      email: user.email,
      role: user.role,
      acess_level: user.acess_level,
      storeUnitId: user.storeUnitId,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    const { password: _, ...userWithoutPassword } = user;
    return {
      message: 'Login realizado com sucesso!',
      accessToken,
      account: { type: 'user' as const, ...userWithoutPassword },
    };
  }

  private async authenticateClient(
    client: NonNullable<
      Awaited<ReturnType<PrismaService['client']['findFirst']>>
    >,
    password: string,
  ) {
    if (!client.status) {
      throw new UnauthorizedException('Conta inativa. Contate o suporte.');
    }

    const passwordMatches = await bcrypt.compare(password, client.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload = {
      sub: client.id,
      type: 'client' as const,
      email: client.email,
      acess_level: client.acess_level,
      restaurant: client.restaurant,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    const { password: _, ...clientWithoutPassword } = client;
    return {
      message: 'Login realizado com sucesso!',
      accessToken,
      account: { type: 'client' as const, ...clientWithoutPassword },
    };
  }
}