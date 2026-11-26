import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendPasswordResetEmail(email: string, token: string) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const frontendUrl = process.env.FRONTEND_URL;

    if (!apiKey || !from || !frontendUrl) {
      throw new InternalServerErrorException(
        'Configure RESEND_API_KEY, RESEND_FROM_EMAIL e FRONTEND_URL para enviar e-mails.',
      );
    }

    const resetUrl = new URL(
      '/nova-senha',
      `${frontendUrl.replace(/\/+$/, '')}/`,
    );
    resetUrl.searchParams.set('token', token);

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [email],
      subject: 'Recuperação de senha',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2>Redefinição de Senha</h2>
          <p>Recebemos uma solicitação para alterar a senha da sua conta.</p>
          <p>Clique no botão abaixo para cadastrar uma nova senha. <strong>O link expira em 1 hora.</strong></p>
          <div style="margin: 28px 0;">
            <a href="${resetUrl.toString()}"
               style="background-color: #191444; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Redefinir minha senha
            </a>
          </div>
          <p style="font-size: 13px; color: #777;">Se você não solicitou essa troca, apenas ignore este e-mail.</p>
        </div>
      `,
    });

    if (error) {
      this.logger.error(
        `Erro ao enviar e-mail de recuperação via Resend: ${JSON.stringify(error)}`,
      );
      throw new InternalServerErrorException(
        'Falha ao enviar o e-mail de recuperação.',
      );
    }
  }
}
