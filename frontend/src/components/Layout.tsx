import type { ReactNode } from "react";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">{children}</div>
    </div>
  );
}
