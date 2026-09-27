import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { OrdersService } from './orders.service.js';

import { AuthGuard } from '../auth/auth.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';

@Controller('orders')
export class OrdersController {

  constructor(
    private readonly ordersService: OrdersService,
  ) {}


  // =========================
  // CREATE ORDER
  // =========================

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req: any) {

    const userId = Number(req.user.sub);

    return this.ordersService.create(userId);
  }


  // =========================
  // GET USER ORDERS
  // =========================

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  findByUser(
    @Param('userId') userId: string,
  ) {

    return this.ordersService.findByUser(
      Number(userId),
    );
  }


  // =========================
  // ADMIN - GET ALL ORDERS
  // =========================

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  findAll() {

    return this.ordersService.findAll();
  }


  // =========================
  // ADMIN - UPDATE STATUS
  // =========================

  @Patch(':id/status')
  @UseGuards(AuthGuard, AdminGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {

    return this.ordersService.updateStatus(
      Number(id),
      body.status,
    );
  }
}