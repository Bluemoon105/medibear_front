// src/config/axiosPlain.ts
import axios from "axios";

const BASE_URI = import.meta.env.VITE_CORS_ALLOWED_ORIGINS;
const axiosPlain = axios.create({
  baseURL: BASE_URI,
  withCredentials: true,
});

export default axiosPlain;