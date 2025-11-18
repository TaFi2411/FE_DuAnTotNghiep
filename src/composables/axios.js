
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

instance.interceptors.request.use((config) => {
  const url = config.url || "";


  if (
    url.startsWith("/auth/") ||        
    url.startsWith("/api/ghn/") ||     
    url.startsWith("/api/address/") || 
     url.startsWith("/api/vnpay/") ||
    url.startsWith("/ghn/")            
  ) {
    return config;
  }


  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
