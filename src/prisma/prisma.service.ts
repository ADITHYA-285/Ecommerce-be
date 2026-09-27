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
    console.log('=== PRISMA CONSTRUCTOR ===');

    console.log('HOST:', process.env.DATABASE_HOST);
    console.log('USER:', process.env.DATABASE_USER);
    console.log('DATABASE:', process.env.DATABASE_NAME);
    console.log('PORT:', process.env.DATABASE_PORT);
    console.log(
      'PASSWORD EXISTS:',
      !!process.env.DATABASE_PASSWORD,
    );

    const adapter = new PrismaMariaDb({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: Number(process.env.DATABASE_PORT),

      ssl: {
        minVersion: 'TLSv1.2',
      },

      connectionLimit: 5,
    });

    super({ adapter });

    console.log('=== PRISMA CLIENT CREATED ===');
  }

  async onModuleInit() {
    console.log('=== CONNECTING TO DATABASE ===');

    try {
      await this.$connect();

      console.log('=== DATABASE CONNECTED ===');
    } catch (error) {
      console.error('=== DATABASE CONNECTION FAILED ===');
      console.error(error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}