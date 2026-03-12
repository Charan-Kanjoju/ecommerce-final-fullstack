import { api } from "./client";

type AuthPayload = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data as AuthPayload;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);
  return res.data as AuthPayload;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};
