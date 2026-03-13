import { X } from "lucide-react";
import { useToastStore } from "../store/useToastStore";

export default function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[90] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto rounded-2xl border border-rose-200 bg-white/95 p-4 shadow-xl backdrop-blur"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-rose-500" />
            <p className="flex-1 text-sm text-zinc-700">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded-full p-1 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
