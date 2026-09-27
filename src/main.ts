import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

let app: any;

async function bootstrap() {
  if (!app) {
    const nestApp = await NestFactory.create(AppModule);

    await nestApp.init();

    app = nestApp.getHttpAdapter().getInstance();
  }

  return app;
}

export default async function handler(
  req: any,
  res: any,
) {
  const server = await bootstrap();

  return server(req, res);
}