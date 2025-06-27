// src/lib/api.ts
import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:8000/api", // 🔁 Change to your actual API base
  headers: {
    "Content-Type": "application/json"
  }
})

export default API
