export class CreateCartDto {
  userId: number;
}

export class CreateCartItemDto {
  cartId: number;
  productId: number;
  quantity: number;
}