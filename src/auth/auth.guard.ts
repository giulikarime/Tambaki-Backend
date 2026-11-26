import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AccessLevel, canAccessRoute } from './access-policy';

interface AuthPayload {
  sub: number;
  type: 'user' | 'client';
  name?: string;
  access_level?: AccessLevel;
}

type AuthenticatedRequest = Request & { user?: AuthPayload };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const method = request.method.toUpperCase();
    const segments = request.path.split('/').filter(Boolean);
    if (segments[0] === 'api') segments.shift();
    const route = segments[0] ?? '';

    if (
      method === 'OPTIONS' ||
      (route === 'auth' &&
        method === 'POST' &&
        [
          'register',
          'login',
          'logout',
          'forgot-password',
          'reset-password',
        ].includes(segments[1] ?? ''))
    ) {
      return true;
    }

    const authorization = request.headers.authorization;
    const token = authorization?.startsWith('Bearer ')
      ? authorization.slice('Bearer '.length)
      : undefined;
    if (!token) throw new UnauthorizedException('Autenticação necessária.');

    let payload: AuthPayload;
    try {
      payload = await this.jwtService.verifyAsync<AuthPayload>(token);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    if (payload.type !== 'user' || !payload.sub) {
      throw new ForbiddenException('Esta conta não possui acesso ao sistema.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { name: true, active: true, access_level: true },
    });
    if (!user || !user.active) {
      throw new UnauthorizedException('Usuário inválido ou inativo.');
    }

    payload.name = user.name;
    payload.access_level = user.access_level;
    request.user = payload;
    const allowed = canAccessRoute(
      user.access_level,
      method,
      route,
      segments.slice(1),
    );
    if (!allowed) {
      throw new ForbiddenException('Seu nível de acesso não permite esta ação.');
    }

    await this.preventSeniorMasterDemotion(request, user.access_level, route, method);
    return true;
  }

  private async preventSeniorMasterDemotion(
    request: AuthenticatedRequest,
    level: AccessLevel,
    route: string,
    method: string,
  ): Promise<void> {
    if (level !== 'Senior' || route !== 'users') return;

    const requestedLevel = (request.body as { access_level?: AccessLevel })
      ?.access_level;
    if (method === 'POST' && requestedLevel === 'Master') {
      throw new ForbiddenException('Somente um Master pode criar usuários Master.');
    }
    if (method !== 'PATCH' || !requestedLevel) return;

    const userId = Number(request.params.id);
    if (!Number.isInteger(userId)) return;

    const target = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { access_level: true },
    });
    if (target?.access_level === 'Master' && requestedLevel !== 'Master') {
      throw new ForbiddenException('Usuários Master não podem ser rebaixados.');
    }
    if (requestedLevel === 'Master' && target?.access_level !== 'Master') {
      throw new ForbiddenException('Somente um Master pode promover a Master.');
    }
  }
}
