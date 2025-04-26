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


  export const fetchDashboardStats = async (authToken: string) => {
    console.log("authToken", authToken);
    const res = await axiosInstance.get("/dashboard-stats",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    const data = await res?.data;
    return data;
  };