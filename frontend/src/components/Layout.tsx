import type { ReactNode } from "react";
import Navbar from "./Navbar";
import { CartDrawer } from "../features/cart/components/CartDrawer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f4f4f5_0%,_#ffffff_45%)] text-zinc-900">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl animate-in fade-in-0 px-4 py-8 duration-300 md:px-6">{children}</main>
      <CartDrawer />
    </div>
  );
}
