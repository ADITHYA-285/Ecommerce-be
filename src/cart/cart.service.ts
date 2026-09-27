import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CartService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================
  // CREATE / GET CART
  // =========================

  async create(userId: number) {

    const existingCart =
      await this.prisma.cart.findUnique({
        where: {
          userId: userId,
        },
      });

    if (existingCart) {
      return existingCart;
    }

    return this.prisma.cart.create({
      data: {
        userId: userId,
      },
    });
  }


  // =========================
  // GET USER CART
  // =========================

  async findByUser(userId: number) {

    return this.prisma.cart.findUnique({
      where: {
        userId: userId,
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }


  // =========================
  // ADD / INCREASE ITEM
  // =========================

  async addItem(
    userId: number,
    productId: number,
    quantity: number,
  ) {

    // Find user's cart
    let cart =
      await this.prisma.cart.findUnique({
        where: {
          userId: userId,
        },
      });

    // Create cart if it doesn't exist
    if (!cart) {

      cart = await this.prisma.cart.create({
        data: {
          userId: userId,
        },
      });
    }

    // Check if product already exists
    const existingItem =
      await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: productId,
        },
      });

    // Product already exists → increase quantity
    if (existingItem) {

      return this.prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },

        data: {
          quantity: {
            increment: quantity,
          },
        },
      });
    }

    // Product doesn't exist → create item
    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      },
    });
  }


  // =========================
  // DECREASE QUANTITY
  // =========================

  async decreaseQuantity(
    userId: number,
    productId: number,
  ) {

    const cart =
      await this.prisma.cart.findUnique({
        where: {
          userId: userId,
        },
      });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const existingItem =
      await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: productId,
        },
      });

    if (!existingItem) {
      throw new Error('Cart item not found');
    }

    // If quantity > 1 → decrease
    if (existingItem.quantity > 1) {

      return this.prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },

        data: {
          quantity: {
            decrement: 1,
          },
        },
      });
    }

    // Quantity = 1 → remove item
    return this.prisma.cartItem.delete({
      where: {
        id: existingItem.id,
      },
    });
  }


  // =========================
  // REMOVE ITEM
  // =========================

  async removeItem(
    userId: number,
    productId: number,
  ) {

    const cart =
      await this.prisma.cart.findUnique({
        where: {
          userId: userId,
        },
      });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const existingItem =
      await this.prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: productId,
        },
      });

    if (!existingItem) {
      throw new Error('Cart item not found');
    }

    return this.prisma.cartItem.delete({
      where: {
        id: existingItem.id,
      },
    });
  }
}