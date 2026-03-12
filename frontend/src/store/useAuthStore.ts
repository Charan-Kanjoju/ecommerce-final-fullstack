import { create } from "zustand";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (payload: { accessToken: string; user: AuthUser }) => void;
  setAccessToken: (accessToken: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  user: localStorage.getItem("authUser")
    ? JSON.parse(localStorage.getItem("authUser") as string)
    : null,
  isAuthenticated: !!localStorage.getItem("accessToken"),

  setAuth: ({ accessToken, user }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("authUser", JSON.stringify(user));

    set({
      accessToken,
      user,
      isAuthenticated: true,
    });
  },

  setAccessToken: (accessToken) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }

    set({
      accessToken,
      isAuthenticated: !!accessToken,
    });
  },

  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");

    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
