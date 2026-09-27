import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ProductsService } from './products.service.js';

import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

import { AuthGuard } from '../auth/auth.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';

@Controller('products')
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,
  ) {}

  // ADMIN ONLY
  @Post()
  @UseGuards(AuthGuard, AdminGuard)
  create(
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(
      createProductDto,
    );
  }

  // PUBLIC
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Patch(':id')
@UseGuards(AuthGuard, AdminGuard)
update(
  @Param('id') id: string,
  @Body() updateProductDto: UpdateProductDto,
) {
  return this.productsService.update(
    Number(id),
    updateProductDto,
  );
}

@Delete(':id')
@UseGuards(AuthGuard, AdminGuard)
remove(@Param('id') id: string) {
  return this.productsService.remove(Number(id));
}
}