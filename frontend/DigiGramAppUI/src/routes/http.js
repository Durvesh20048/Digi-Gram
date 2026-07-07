// src/services/http.js
import axios from "axios";
import { auth } from "../firebase";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  withCredentials: true,
});

http.interceptors.request.use(async (cfg) => {
  const u = auth.currentUser;
  if (u) {
    const token = await u.getIdToken();
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export const createHttp = () => http;
