import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module.js';

let cachedApp: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.init();

  return app;
}

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }

  return cachedApp.getHttpAdapter().getInstance()(req, res);
}