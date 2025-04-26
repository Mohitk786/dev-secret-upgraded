import axios from "axios";


export const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL as string || "https://api.developermatch.me/api",
  withCredentials: true,
});
