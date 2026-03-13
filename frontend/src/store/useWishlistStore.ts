import { create } from "zustand";

const wishlistStorageKey = (userId: string) => `wishlist:${userId}`;

const readWishlist = (userId: string) => {
  try {
    const stored = localStorage.getItem(wishlistStorageKey(userId));
    const parsed = stored ? (JSON.parse(stored) as string[]) : [];
    return Array.isArray(parsed) ? Array.from(new Set(parsed)) : [];
  } catch {
    return [];
  }
};

const writeWishlist = (userId: string | null, productIds: string[]) => {
  if (!userId) return;
  localStorage.setItem(wishlistStorageKey(userId), JSON.stringify(productIds));
};

type WishlistState = {
  userId: string | null;
  productIds: string[];
  wishlistCount: number;
  hydrateWishlist: (userId: string | null) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  isWishlisted: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  userId: null,
  productIds: [],
  wishlistCount: 0,

  hydrateWishlist: (userId) => {
    const productIds = userId ? readWishlist(userId) : [];
    set({
      userId,
      productIds,
      wishlistCount: productIds.length,
    });
  },

  addToWishlist: (productId) => {
    const { productIds, userId } = get();
    if (productIds.includes(productId)) return;

    const next = [...productIds, productId];
    writeWishlist(userId, next);
    set({ productIds: next, wishlistCount: next.length });
  },

  removeFromWishlist: (productId) => {
    const { productIds, userId } = get();
    const next = productIds.filter((id) => id !== productId);
    writeWishlist(userId, next);
    set({ productIds: next, wishlistCount: next.length });
  },

  toggleWishlist: (productId) => {
    if (get().productIds.includes(productId)) {
      get().removeFromWishlist(productId);
      return false;
    }

    get().addToWishlist(productId);
    return true;
  },

  clearWishlist: () => {
    set({ userId: null, productIds: [], wishlistCount: 0 });
  },

  isWishlisted: (productId) => get().productIds.includes(productId),
}));
