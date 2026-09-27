import 'dotenv/config';

import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    console.log("DATABASE_HOST:", process.env.DATABASE_HOST);
    console.log("DATABASE_USER:", process.env.DATABASE_USER);
    console.log("DATABASE_NAME:", process.env.DATABASE_NAME);
    console.log("DATABASE_PORT:", process.env.DATABASE_PORT);
    console.log(
      "DATABASE_PASSWORD exists:",
      !!process.env.DATABASE_PASSWORD
    );

    const adapter = new PrismaMariaDb({
      host: process.env.DATABASE_HOST!,
      user: process.env.DATABASE_USER!,
      password: process.env.DATABASE_PASSWORD!,
      database: process.env.DATABASE_NAME!,
      port: Number(process.env.DATABASE_PORT),
      connectionLimit: 5,
      allowPublicKeyRetrieval: true,
    });

    super({ adapter });
  }

  async onModuleInit() {
  console.log("Prisma module initialized");
}

  async onModuleDestroy() {
    await this.$disconnect();
  }
}