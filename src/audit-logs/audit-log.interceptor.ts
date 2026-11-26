import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, mergeMap } from 'rxjs';
import { AuditAction } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';

interface AuditRequest extends Request {
  user?: { sub: number; name?: string };
}

const entityNames: Record<string, string> = {
  users: 'Usuário',
  costs: 'Custo',
  products: 'Produto',
  suppliers: 'Fornecedor',
  menu: 'Item do cardápio',
  tags: 'Etiqueta',
  tables: 'Mesa',
  orders: 'Comanda',
  reservations: 'Reserva',
  units: 'Unidade',
  notifications: 'Notificação',
};

const actions: Record<string, AuditAction> = {
  POST: AuditAction.CREATE,
  PUT: AuditAction.UPDATE,
  PATCH: AuditAction.UPDATE,
  DELETE: AuditAction.DELETE,
};

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuditRequest>();
    const routeParts = request.path.split('/').filter(Boolean);
    if (routeParts[0] === 'api') routeParts.shift();
    const route = routeParts[0] ?? '';
    const isMenuTagChange =
      route === 'menu' && routeParts[2] === 'tags';
    const action =
      isMenuTagChange && request.method === 'POST'
        ? AuditAction.UPDATE
        : actions[request.method.toUpperCase()];
    const actor = request.user;
    const entity =
      route === 'orders' && routeParts[2] === 'items'
        ? 'Comanda'
        : entityNames[route];

    if (!action || !actor || !entity || route === 'uploads') {
      return next.handle();
    }

    return next.handle().pipe(
      mergeMap(async (result: unknown) => {
        const params = request.params as Record<string, string | undefined>;
        const resultObject =
          result && typeof result === 'object'
            ? (result as Record<string, unknown>)
            : undefined;
        const nestedRecord =
          resultObject?.user ??
          resultObject?.product ??
          resultObject?.supplier ??
          resultObject?.menu ??
          resultObject?.order ??
          resultObject?.reservation ??
          resultObject?.table;
        const nestedId =
          nestedRecord && typeof nestedRecord === 'object'
            ? (nestedRecord as { id?: unknown }).id
            : undefined;
        const id =
          params.id ??
          params.tagId ??
          (typeof resultObject?.id === 'number' ||
          typeof resultObject?.id === 'string'
            ? resultObject.id
            : undefined) ??
          nestedId;
        const entityId = id === undefined ? undefined : String(id);
        const actionText = {
          [AuditAction.CREATE]: 'Criou',
          [AuditAction.UPDATE]: 'Editou',
          [AuditAction.DELETE]: 'Excluiu',
        }[action];
        let description = `${actionText} ${entity}${entityId ? ` #${entityId}` : ''}`;
        if (isMenuTagChange && entityId) {
          description = `${request.method === 'POST' ? 'Adicionou' : 'Removeu'} etiqueta ao item do cardápio #${entityId}`;
        } else if (route === 'orders' && routeParts[2] === 'items' && entityId) {
          description = `Adicionou item à comanda #${entityId}`;
        } else if (route === 'orders' && routeParts[2] === 'close' && entityId) {
          description = `Fechou comanda #${entityId}`;
        } else if (
          route === 'reservations' &&
          routeParts[2] === 'cancel' &&
          entityId
        ) {
          description = `Cancelou reserva #${entityId}`;
        } else if (
          route === 'products' &&
          routeParts[2] === 'write-off' &&
          entityId
        ) {
          description = `Deu baixa no estoque do produto #${entityId}`;
        }

        await this.prisma.auditLog.create({
          data: {
            actorUserId: actor.sub,
            actorName: actor.name ?? 'Usuário',
            action,
            entity,
            entityId,
            description,
          },
        });

        return result;
      }),
    );
  }
}
