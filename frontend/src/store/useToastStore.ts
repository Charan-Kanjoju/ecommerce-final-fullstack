import { create } from "zustand";

type Toast = {
  id: string;
  message: string;
};

type ToastState = {
  toasts: Toast[];
  showToast: (message: string) => void;
  dismissToast: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    set((state) => ({
      toasts: [...state.toasts, { id, message }],
    }));

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 4000);
  },
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
