// src/services/api.js

import axios from "axios";

// DURANTE DESENVOLVIMENTO use o IP LOCAL da sua máquina
// Acesse CMD e rode: ipconfig
// Pegue algo como: 192.168.0.12

const API_BASE_URL = "http://192.168.18.45:8000"; // <-- troque pelo seu IP

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

export default api;
