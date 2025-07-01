// src/lib/api.ts
import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json"
  }
})

// ✅ Auto-attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers["Authorization"] = `Token ${token}`
  }
  return config
})

export default API
