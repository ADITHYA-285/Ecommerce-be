import 'dotenv/config';

import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  constructor() {
    console.log('=== PRISMA CONSTRUCTOR ===');

    console.log(
      'DATABASE_URL EXISTS:',
      !!process.env.DATABASE_URL,
    );

    const adapter = new PrismaTiDBCloud({
      url: process.env.DATABASE_URL!,
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