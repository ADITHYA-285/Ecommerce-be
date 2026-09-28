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
    console.log('=================================');
    console.log('=== PRISMA CONSTRUCTOR START ===');
    console.log('=================================');

    console.log(
      'DATABASE_URL EXISTS:',
      !!process.env.DATABASE_URL,
    );

    console.log(
      'DATABASE_URL HOST:',
      process.env.DATABASE_URL
        ? new URL(process.env.DATABASE_URL).hostname
        : 'NO URL',
    );

    const adapter = new PrismaTiDBCloud({
      url: process.env.DATABASE_URL!,
    });

    console.log('=== USING TIDB ADAPTER ===');

    super({ adapter });

    console.log('=== TIDB PRISMA CLIENT CREATED ===');
  }

  async onModuleInit() {
    console.log('=== CONNECTING TO DATABASE ===');

    try {
      await this.$connect();

      console.log('=== DATABASE CONNECTED ===');

      // IMPORTANT: actually test a query
      await this.$queryRaw`SELECT 1`;

      console.log('=== DATABASE QUERY SUCCESS ===');

    } catch (error) {
      console.error('=== DATABASE CONNECTION/QUERY FAILED ===');
      console.error(error);

      throw error;
    }
  }

  async onModuleDestroy() {
    console.log('=== DISCONNECTING DATABASE ===');

    await this.$disconnect();
  }
}