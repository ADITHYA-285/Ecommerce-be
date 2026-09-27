import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

type CartItemWithProduct = {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: any;
  };
};

@Injectable()
export class OrdersService {
  async findAll() {
  return this.prisma.order.findMany({
    include: {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
  constructor(private readonly prisma: PrismaService) { }

 async create(userId: number) {

  const cart = await this.prisma.cart.findUnique({
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


  if (!cart) {
    throw new Error("Cart not found");
  }

  if (cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  let totalAmount = 0;

  for (const item of cart.items) {
    totalAmount +=
      Number(item.product.price) * item.quantity;
  }

  const order = await this.prisma.order.create({
    data: {
      userId: userId,
      totalAmount: totalAmount,

      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },

    include: {
      items: true,
    },
  });

  await this.prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  return order;
}

  
  async findByUser(userId: number) {
  return this.prisma.order.findMany({
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
    orderBy: {
      createdAt: 'desc',
    },
  });
}
async updateStatus(
  orderId: number,
  status: string,
) {
  const order = await this.prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  if (
    order.status === 'COMPLETED' ||
    order.status === 'CANCELLED'
  ) {
    throw new Error(
      `Order is already ${order.status} and cannot be changed`,
    );
  }

  return this.prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: status,
    },
  });
}
}
