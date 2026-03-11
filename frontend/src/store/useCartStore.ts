import { create } from "zustand";
import { api } from "../api/client";

interface CartState {
  items: any[];
  cartCount: number;

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  cartCount: 0,

  fetchCart: async () => {
    const res = await api.get("/cart");

    const items = res.data.items ?? [];

    const cartCount = items.reduce(
      (sum: number, item: any) => sum + (item.quantity || 0),
      0,
    );

    set({ items, cartCount });
  },

  addToCart: async (productId, quantity) => {
    await api.post("/cart/add", { productId, quantity });

    const res = await api.get("/cart");
    const items = res.data.items ?? [];

    const cartCount = items.reduce(
      (sum: number, item: any) => sum + (item.quantity || 0),
      0,
    );

    set({ items, cartCount });
  },

  removeFromCart: async (id) => {
    await api.delete("/cart/remove", {
      data: { itemId: id },
    });

    const res = await api.get("/cart");
    const items = res.data.items ?? [];

    const cartCount = items.reduce(
      (sum: number, item: any) => sum + (item.quantity || 0),
      0,
    );

    set({ items, cartCount });
  },
}));
