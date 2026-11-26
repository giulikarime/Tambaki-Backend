import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  const configuredOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  // Domínios oficiais do front-end na Vercel
  const allowedProductionOrigins = [
    'https://tambakib2b.com.br',
    'https://www.tambakib2b.com.br',
    ...configuredOrigins,
  ];

  app.enableCors({
    origin: (requestOrigin, callback) => {
      const isLocalOrigin =
        requestOrigin === undefined ||
        /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(requestOrigin);
      const isConfiguredOrigin =
        requestOrigin !== undefined &&
        allowedProductionOrigins.includes(requestOrigin);

      callback(null, isLocalOrigin || isConfiguredOrigin);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Usa a porta dinâmica do Render em produção ou 3000 localmente
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
void bootstrap();
