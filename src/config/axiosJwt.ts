import axios from "axios";
const BASE_URI = import.meta.env.VITE_CORS_ALLOWED_ORIGINS;
const axiosJwt = axios.create({
  baseURL: BASE_URI,
  withCredentials: true,
});

// 요청 시 Authorization 자동 포함
axiosJwt.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers["Authorization"] =
      token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }

  return config;
});


export default axiosJwt;