import { prisma } from "../lib/prisma";

export const checkoutService = async (userId: string, shipping: any) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart || cart.items?.length === 0) {
    throw new Error("Cart is empty");
  }

  let total = 0;
  const orderItemsData = [];

  for (const item of cart.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product not found");

    const itemTotal = product.price * item.quantity;
    total += itemTotal;

    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const order = await prisma.order.create({
    data: {
      userId,
      total,

      fullName: shipping.fullName,
      addressLine1: shipping.addressLine1,
      addressLine2: shipping.addressLine2,
      city: shipping.city,
      state: shipping.state,
      postalCode: shipping.postalCode,
      country: shipping.country,
      phone: shipping.phone,

      paymentMethod: shipping.paymentMethod,

      items: {
        create: orderItemsData,
      },
    },
    include: { items: true },
  });

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return order;
};
export const getOrdersService = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getOrderByIdService = async (userId: string, orderId: string) => {
  return prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: true,
    },
  });
};
