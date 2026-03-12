import { api } from "../api/client";

export type OrderStatus = "PENDING" | "SHIPPED" | "DELIVERED";

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    image: string;
  };
};

export type Order = {
  id: string;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  createdAt: string;
  items: OrderItem[];
};

export const fetchOrders = async () => {
  const response = await api.get("/orders");
  return response.data as Order[];
};

export const fetchOrderById = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data as Order;
};
