import { prisma } from "../lib/prisma";

export const checkoutService = async (userId: string, shipping: any) => {
  const cleanedShipping = {
    fullName: String(shipping?.fullName ?? "").trim(),
    addressLine1: String(shipping?.addressLine1 ?? "").trim(),
    addressLine2: String(shipping?.addressLine2 ?? "").trim(),
    city: String(shipping?.city ?? "").trim(),
    state: String(shipping?.state ?? "").trim(),
    postalCode: String(shipping?.postalCode ?? "").trim(),
    country: String(shipping?.country ?? "").trim(),
    phone: String(shipping?.phone ?? "").trim(),
    paymentMethod: String(shipping?.paymentMethod ?? "COD").trim() || "COD",
  };

  const requiredFields = [
    "fullName",
    "addressLine1",
    "city",
    "state",
    "postalCode",
    "country",
    "phone",
  ];

  for (const field of requiredFields) {
    if (!cleanedShipping[field as keyof typeof cleanedShipping]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (!/^[a-zA-Z0-9\s-]{3,12}$/.test(cleanedShipping.postalCode)) {
    throw new Error("Postal code must be 3 to 12 characters and contain only letters, numbers, spaces, or hyphens");
  }

  if (!/^[0-9+\s()-]{7,20}$/.test(cleanedShipping.phone)) {
    throw new Error("Phone number must be 7 to 20 characters and contain only digits or standard phone symbols");
  }

  if (!["COD", "CARD"].includes(cleanedShipping.paymentMethod)) {
    throw new Error("Invalid payment method");
  }

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

      fullName: cleanedShipping.fullName,
      addressLine1: cleanedShipping.addressLine1,
      addressLine2: cleanedShipping.addressLine2 || null,
      city: cleanedShipping.city,
      state: cleanedShipping.state,
      postalCode: cleanedShipping.postalCode,
      country: cleanedShipping.country,
      phone: cleanedShipping.phone,

      paymentMethod: cleanedShipping.paymentMethod,

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
      items: {
        include: {
          product: true,
        },
      },
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
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};
