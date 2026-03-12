import { prisma } from "../lib/prisma";

export const getOrCreateCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
      include: { items: true },
    });
  }

  return cart;
};

export const addToCartService = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};
export const getCartService = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          cart: false,
        },
      },
    },
  });

  return cart;
};

export const updateCartItemService = async (
  userId: string,
  itemId: string,
  quantity: number,
) => {
  const cart = await getOrCreateCart(userId);
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (!item || item.cartId !== cart.id) {
    throw new Error("Cart item not found");
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
};

export const removeCartItemService = async (userId: string, itemId: string) => {
  const cart = await getOrCreateCart(userId);
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (!item || item.cartId !== cart.id) {
    throw new Error("Cart item not found");
  }

  return prisma.cartItem.delete({
    where: { id: itemId },
  });
};

export const clearCartService = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) return;

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
};
