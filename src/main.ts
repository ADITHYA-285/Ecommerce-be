import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

let cachedHandler: any;

async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://YOUR-FRONTEND-VERCEL-URL.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  return app;
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  if (!cachedHandler) {
    console.log('=== STARTING NESTJS APPLICATION ===');

    const app = await createApp();

    await app.init();

    cachedHandler = app.getHttpAdapter().getInstance();

    console.log('=== NESTJS APPLICATION READY ===');
  }

  return cachedHandler(req, res);
}

// Local development
if (!process.env.VERCEL) {
  async function bootstrap() {
    const app = await createApp();

    const port = Number(process.env.PORT) || 3000;

    await app.listen(port);

    console.log(`NestJS server running on port ${port}`);
  }

  bootstrap();
}