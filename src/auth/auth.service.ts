<<<<<<< Updated upstream
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './login.dto';
import { RegisterClientDto } from './register-client.dto';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';

const SALT_ROUNDS = 10;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
const PASSWORD_RESET_MESSAGE =
  'Se o e-mail estiver cadastrado, enviaremos um link em instantes.';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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
        ...dto,
        password: hashedPassword,
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
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { storeUnit: true },
    });
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

  async logout() {
    return {
      message: 'Logout realizado com sucesso!',
    };
  }

  private async authenticateUser(
    user: NonNullable<Awaited<ReturnType<PrismaService['user']['findFirst']>>>,
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
      access_level: user.access_level,
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
      access_level: client.access_level,
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
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      select: { id: true, email: true },
    });
    const client = user
      ? null
      : await this.prisma.client.findFirst({
          where: { email },
          select: { id: true, email: true },
        });

    const account = user ?? client;
    if (!account) {
      return { message: PASSWORD_RESET_MESSAGE };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { resetTokenHash: tokenHash, resetTokenExpires: expiresAt },
      });
    } else if (client) {
      await this.prisma.client.update({
        where: { id: client.id },
        data: { resetTokenHash: tokenHash, resetTokenExpires: expiresAt },
      });
    }

    try {
      await this.mailService.sendPasswordResetEmail(account.email, token);
    } catch (error) {
      if (user) {
        await this.prisma.user.updateMany({
          where: { id: user.id, resetTokenHash: tokenHash },
          data: { resetTokenHash: null, resetTokenExpires: null },
        });
      } else if (client) {
        await this.prisma.client.updateMany({
          where: { id: client.id, resetTokenHash: tokenHash },
          data: { resetTokenHash: null, resetTokenExpires: null },
        });
      }
      throw error;
    }

    return { message: PASSWORD_RESET_MESSAGE };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    const now = new Date();

    const userUpdate = await this.prisma.user.updateMany({
      where: {
        resetTokenHash: tokenHash,
        resetTokenExpires: { gt: now },
      },
      data: {
        password: hashedPassword,
        resetTokenHash: null,
        resetTokenExpires: null,
      },
    });

    if (userUpdate.count === 0) {
      const clientUpdate = await this.prisma.client.updateMany({
        where: {
          resetTokenHash: tokenHash,
          resetTokenExpires: { gt: now },
        },
        data: {
          password: hashedPassword,
          resetTokenHash: null,
          resetTokenExpires: null,
        },
      });

      if (clientUpdate.count === 0) {
        throw new BadRequestException(
          'Link inválido ou expirado. Solicite novamente.',
        );
      }
    }

    return { message: 'Senha alterada com sucesso!' };
  }
}
=======
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
  ) { }

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
        ...dto,
        password: hashedPassword,
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
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { storeUnit: true },
    });
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

  async logout() {
    return {
      message: 'Logout realizado com sucesso!',
    };
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
      name: user.name,
      role: user.role,
      access_level: user.access_level,
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
      access_level: client.access_level,
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
>>>>>>> Stashed changes
