import axios, { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => api.post("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },
};

// Transaction endpoints
export const transactionsAPI = {
  getAll: (params?: {
    startDate?: string;
    endDate?: string;
    category?: string;
  }) => api.get("/transactions", { params }),

  getById: (id: string) => api.get(`/transactions/${id}`),

  create: (data: {
    date: string;
    description: string;
    amount: number;
    category: string;
    type: "income" | "expense";
  }) => api.post("/transactions", data),

  update: (id: string, data: any) => api.put(`/transactions/${id}`, data),

  delete: (id: string) => api.delete(`/transactions/${id}`),

  uploadCSV: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/transactions/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Budget endpoints
export const budgetsAPI = {
  getAll: () => api.get("/budgets"),

  getById: (id: string) => api.get(`/budgets/${id}`),

  create: (data: { category: string; limit: number; month: string }) =>
    api.post("/budgets", data),

  update: (id: string, data: any) => api.put(`/budgets/${id}`, data),

  delete: (id: string) => api.delete(`/budgets/${id}`),

  getCurrentMonth: () => api.get("/budgets/current-month"),
};

// Analysis endpoints
export const analysisAPI = {
  getAnalysis: (month?: string) => api.get("/analysis", { params: { month } }),

  getMonthlyAnalysis: (month: string) => api.get(`/analysis/monthly/${month}`),

  generateNewAnalysis: (month?: string) =>
    api.post("/analysis/generate", { month }),
};

export default api;
