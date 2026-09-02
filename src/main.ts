import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Lê as origens adicionais permitidas a partir do arquivo .env.
  const configuredOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (requestOrigin, callback) => {
      // Permite o frontend local durante o desenvolvimento.
      const isLocalOrigin =
        requestOrigin === undefined ||
        /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(requestOrigin);

      // Também permite as origens definidas em CORS_ORIGINS.
      const isConfiguredOrigin =
        requestOrigin !== undefined && configuredOrigins.includes(requestOrigin);

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

  await app.listen(3000);
}
bootstrap();