import axios from "axios";
import { config } from '@secret-vault/backend-common/config';

const API_URL = config.BASE_URL || "http://localhost:5000/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


