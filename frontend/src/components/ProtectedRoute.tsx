import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { bootstrapAuthSession } from "../api/client";

export default function ProtectedRoute({ children }: any) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setChecking(false);
      return;
    }

    const run = async () => {
      await bootstrapAuthSession();
      setChecking(false);
    };
    run();
  }, [isAuthenticated]);

  if (checking) {
    return <div className="p-10 text-center text-sm text-zinc-500">Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}
