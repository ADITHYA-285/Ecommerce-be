import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CartService } from './cart.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {

  constructor(
    private readonly cartService: CartService,
  ) {}


  // =========================
  // GET CART
  // =========================

  @Get()
  findMyCart(@Req() req: any) {

    return this.cartService.findByUser(
      Number(req.user.sub),
    );
  }


  // =========================
  // CREATE CART
  // =========================

  @Post()
  create(@Req() req: any) {

    return this.cartService.create(
      Number(req.user.sub),
    );
  }


  // =========================
  // ADD / INCREASE
  // =========================

  @Post('item')
  addItem(
    @Req() req: any,

    @Body()
    body: {
      productId: number;
      quantity: number;
    },
  ) {

    return this.cartService.addItem(
      Number(req.user.sub),
      Number(body.productId),
      Number(body.quantity),
    );
  }


  // =========================
  // DECREASE
  // =========================

  @Patch('item/decrease')
  decreaseQuantity(
    @Req() req: any,

    @Body()
    body: {
      productId: number;
    },
  ) {

    return this.cartService.decreaseQuantity(
      Number(req.user.sub),
      Number(body.productId),
    );
  }


  // =========================
  // REMOVE
  // =========================

  @Delete('item')
  removeItem(
    @Req() req: any,

    @Body()
    body: {
      productId: number;
    },
  ) {

    return this.cartService.removeItem(
      Number(req.user.sub),
      Number(body.productId),
    );
  }
}