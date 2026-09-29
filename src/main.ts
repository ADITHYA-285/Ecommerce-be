import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

let cachedHandler: any;

async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const allowedOrigins = [
        'https://ecommerce-fe-mu-sage.vercel.app',
        'https://ecommerce-bvwi15pei-adithyas-projects-e20db2dd.vercel.app',
      ];

      // Allow requests without Origin, such as curl/server-to-server
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },

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