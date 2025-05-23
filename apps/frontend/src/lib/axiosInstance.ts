import axios from "axios";



export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL as string || "https://api.developermatch.me/api",
  withCredentials: true,
});
