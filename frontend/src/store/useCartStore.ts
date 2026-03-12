import { create } from "zustand";
import { api } from "../api/client";

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  cartCount: number;
  isDrawerOpen: boolean;

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  setDrawerOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  cartCount: 0,
  isDrawerOpen: false,

  setDrawerOpen: (isDrawerOpen) => set({ isDrawerOpen }),

  fetchCart: async () => {
    try {
      const res = await api.get("/cart");
      const items = (res.data.items ?? []) as CartItem[];

      const cartCount = items.reduce(
        (sum: number, item: CartItem) => sum + (item.quantity || 0),
        0,
      );

      set({ items, cartCount });
    } catch {
      set({ items: [], cartCount: 0 });
    }
  },

  addToCart: async (productId, quantity) => {
    const previousState = useCartStore.getState();
    const existing = previousState.items.find((item) => item.productId === productId);

    const optimisticItems = existing
      ? previousState.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      : [
          ...previousState.items,
          { id: `optimistic-${productId}`, productId, quantity } as CartItem,
        ];

    set({
      items: optimisticItems,
      cartCount: optimisticItems.reduce((sum, item) => sum + item.quantity, 0),
    });

    try {
      await api.post("/cart/add", { productId, quantity });
      await previousState.fetchCart();
    } catch {
      set({ items: previousState.items, cartCount: previousState.cartCount });
      throw new Error("Failed to add to cart");
    }
  },

  updateCartItem: async (itemId, quantity) => {
    const previousState = useCartStore.getState();
    const optimisticItems = previousState.items
      .map((item) => (item.id === itemId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);

    set({
      items: optimisticItems,
      cartCount: optimisticItems.reduce((sum, item) => sum + item.quantity, 0),
    });

    try {
      await api.put("/cart/update", { itemId, quantity });
      await previousState.fetchCart();
    } catch {
      set({ items: previousState.items, cartCount: previousState.cartCount });
      throw new Error("Failed to update cart");
    }
  },

  removeFromCart: async (id) => {
    const previousState = useCartStore.getState();
    const optimisticItems = previousState.items.filter((item) => item.id !== id);

    set({
      items: optimisticItems,
      cartCount: optimisticItems.reduce((sum, item) => sum + item.quantity, 0),
    });

    try {
      await api.delete("/cart/remove", {
        data: { itemId: id },
      });
      await previousState.fetchCart();
    } catch {
      set({ items: previousState.items, cartCount: previousState.cartCount });
      throw new Error("Failed to remove item");
    }
  },
}));
