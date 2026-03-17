import axios from "axios";
import { getApiErrorMessage } from "../lib/api-error";
import { useAuthStore } from "../store/useAuthStore";
import { useToastStore } from "../store/useToastStore";

export const api = axios.create({
  baseURL: "https://ecommerce-final-fullstack.onrender.com/api",
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: "https://ecommerce-final-fullstack.onrender.com/api",
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;
let bootstrapPromise: Promise<string | null> | null = null;
let hasBootstrappedAuth = false;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh")
      .then((res) => {
        const accessToken = res.data?.accessToken as string | undefined;
        if (!accessToken) return null;
        useAuthStore.getState().setAccessToken(accessToken);
        return accessToken;
      })
      .catch(() => {
        useAuthStore.getState().clearAuth();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as any;

    if (!error.response || !originalRequest) {
      useToastStore.getState().showToast(getApiErrorMessage(error));
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      typeof originalRequest.url === "string" &&
      (originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/register") ||
        originalRequest.url.includes("/auth/refresh") ||
        originalRequest.url.includes("/auth/logout"));

    if (error.response.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      const nextToken = await refreshAccessToken();

      if (nextToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${nextToken}`;
        return api(originalRequest);
      }
    }

    if (!originalRequest.skipErrorToast) {
      useToastStore.getState().showToast(getApiErrorMessage(error));
    }

    return Promise.reject(error);
  },
);

export const bootstrapAuthSession = async () => {
  const token = useAuthStore.getState().accessToken;
  if (token) return token;
  if (hasBootstrappedAuth) return null;

  if (!bootstrapPromise) {
    bootstrapPromise = refreshAccessToken().finally(() => {
      hasBootstrappedAuth = true;
      bootstrapPromise = null;
    });
  }

  return bootstrapPromise;
};
