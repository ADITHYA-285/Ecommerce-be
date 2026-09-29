import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

let cachedHandler: any;

const allowedOrigins = [
  'http://localhost:5173',
  'https://ecommerce-fe-mu-sage.vercel.app',
];

async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests without an Origin header
      // such as curl/server-to-server requests.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },

    credentials: true,

    methods: [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  });

  return app;
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {

  // Explicitly handle browser preflight requests
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      );
      res.setHeader('Vary', 'Origin');
    }

    return res.status(204).end();
  }

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