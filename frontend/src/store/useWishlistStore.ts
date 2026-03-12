import { create } from "zustand";

type WishlistState = {
  productIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  productIds: [],
  toggleWishlist: (productId) => {
    const existing = get().productIds;
    const next = existing.includes(productId)
      ? existing.filter((id) => id !== productId)
      : [...existing, productId];

    set({ productIds: next });
  },
  isWishlisted: (productId) => get().productIds.includes(productId),
}));
