import axios from "axios";
import { axiosInstance } from "@/lib/axiosInstance";

export const getRandomDevMeme = async () => {
    const res = await axios.get("/api/dev-meme");
    const data = await res?.data;
    return {
      title: data.title,
      imageUrl: data.imageUrl,
      postLink: data.postLink,
      author: data.author,
    };
  };


  export const getDashboardStats = async () => {
    const res = await axiosInstance.get("/dashboard-stats");
    const data = await res?.data;
    return data;
  };