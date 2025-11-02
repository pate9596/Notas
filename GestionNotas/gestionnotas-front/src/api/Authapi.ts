import axios from "axios";

// 👇 Usa el puerto REAL de tu backend (.NET)
const API_URL = "http://localhost:5269/api/auth";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export const registerUser = (data: { nombre: string; email: string; password: string }) =>
  api.post("/register", data);

export const loginUser = (data: { email: string; password: string }) =>
  api.post("/login", data);
