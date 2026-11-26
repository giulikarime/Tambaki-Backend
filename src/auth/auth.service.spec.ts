import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import type { JwtService } from '@nestjs/jwt';
import type { PrismaService } from '../prisma/prisma.service';
import type { MailService } from '../mail/mail.service';
import { AuthService } from './auth.service';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('AuthService password reset', () => {
  let prisma: {
    user: {
      findFirst: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
    client: {
      findFirst: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
    };
  };
  let mailService: { sendPasswordResetEmail: jest.Mock };
  let service: AuthService;

  beforeEach(() => {
    prisma = {
      user: {
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      client: {
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    mailService = { sendPasswordResetEmail: jest.fn() };
    service = new AuthService(
      prisma as unknown as PrismaService,
      {} as JwtService,
      mailService as unknown as MailService,
    );
  });

  it('does not disclose whether an email is registered', async () => {
    prisma.user.findFirst.mockResolvedValue(null);
    prisma.client.findFirst.mockResolvedValue(null);

    await expect(
      service.forgotPassword('unknown@example.com'),
    ).resolves.toEqual({
      message:
        'Se o e-mail estiver cadastrado, enviaremos um link em instantes.',
    });
    expect(mailService.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('stores only a hash of the reset token before sending the email', async () => {
    prisma.user.findFirst.mockResolvedValue({
      id: 7,
      email: 'user@example.com',
    });
    prisma.user.update.mockResolvedValue({});
    mailService.sendPasswordResetEmail.mockResolvedValue(undefined);

    await service.forgotPassword('user@example.com');

    const [email, token] = mailService.sendPasswordResetEmail.mock.calls[0] as [
      string,
      string,
    ];
    const userUpdateCall = prisma.user.update.mock.calls[0] as [
      { data: { resetTokenHash: string } },
    ];
    const storedHash = userUpdateCall[0].data.resetTokenHash;
    expect(email).toBe('user@example.com');
    expect(token).toMatch(/^[a-f0-9]{64}$/);
    expect(storedHash).toBe(
      crypto.createHash('sha256').update(token).digest('hex'),
    );
    expect(storedHash).not.toBe(token);
  });

  it('resets a client password and consumes the token once', async () => {
    prisma.user.updateMany.mockResolvedValue({ count: 0 });
    prisma.client.updateMany.mockResolvedValue({ count: 1 });
    const token = 'a'.repeat(64);

    await expect(service.resetPassword(token, 'new-password')).resolves.toEqual(
      {
        message: 'Senha alterada com sucesso!',
      },
    );

    const updateCall = prisma.client.updateMany.mock.calls[0] as [
      {
        where: { resetTokenHash: string };
        data: {
          password: string;
          resetTokenHash: string | null;
          resetTokenExpires: Date | null;
        };
      },
    ];
    const update = updateCall[0];
    expect(update.where.resetTokenHash).toBe(
      crypto.createHash('sha256').update(token).digest('hex'),
    );
    expect(await bcrypt.compare('new-password', update.data.password)).toBe(
      true,
    );
    expect(update.data.resetTokenHash).toBeNull();
    expect(update.data.resetTokenExpires).toBeNull();
  });

  it('rejects invalid or expired reset tokens', async () => {
    prisma.user.updateMany.mockResolvedValue({ count: 0 });
    prisma.client.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.resetPassword('invalid-token', 'new-password'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
