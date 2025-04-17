import { axiosInstance } from "@/lib/axiosInstance";

export interface SignupData {
  email: string;
  password: string;
  publicKey: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  const response = await axiosInstance.post("/signup", data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await axiosInstance.post("/login", data, {
    withCredentials: true,
  });
  return response.data;
};

export const fetchUser = async () => {
  const response = await axiosInstance.get("/me", {
    withCredentials: true,
  });
  return response.data;
};
