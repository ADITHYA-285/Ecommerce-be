import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductsService {
 
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany();
  }

  async update(
  id: number,
  updateProductDto: UpdateProductDto,
) {
  return this.prisma.product.update({
    where: {
      id: id,
    },
    data: updateProductDto,
  });
}
async remove(id: number) {
  return this.prisma.product.delete({
    where: {
      id: id,
    },
  });
}
}