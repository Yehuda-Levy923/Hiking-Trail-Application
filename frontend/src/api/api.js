import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message from response
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", {
        url: error.config?.url,
        status: error.response?.status,
        message,
      });
    }

    return Promise.reject(new Error(message));
  }
);

// ============================================
// Trails API
// ============================================
export const trailsApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.difficulty) params.append("difficulty", filters.difficulty);
    if (filters.maxLength) params.append("maxLength", filters.maxLength);
    if (filters.location) params.append("location", filters.location);

    const response = await api.get(`/trails?${params}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/trails/${id}`);
    return response.data;
  },

  create: async (trailData) => {
    const response = await api.post("/trails", trailData);
    return response.data;
  },

  update: async (id, trailData) => {
    const response = await api.put(`/trails/${id}`, trailData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/trails/${id}`);
    return response.data;
  },
};

// ============================================
// Traffic API
// ============================================
export const trafficApi = {
  getAll: async () => {
    const response = await api.get("/traffic");
    return response.data;
  },

  getByTrailId: async (trailId) => {
    const response = await api.get(`/traffic/${trailId}`);
    return response.data;
  },

  refresh: async () => {
    const response = await api.get("/traffic/refresh");
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/traffic/stats");
    return response.data;
  },

  update: async (trailId, data) => {
    const response = await api.put(`/traffic/${trailId}`, data);
    return response.data;
  },
};

export default api;
