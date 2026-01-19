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
  getAll: async (filters = {}, pagination = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.difficulty) params.append("difficulty", filters.difficulty);
    if (filters.maxLength) params.append("maxLength", filters.maxLength);
    if (filters.location) params.append("location", filters.location);
    if (pagination.page) params.append("page", pagination.page);
    if (pagination.limit) params.append("limit", pagination.limit);

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

// ============================================
// Auth API
// ============================================
export const authApi = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, password, confirmPassword) => {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
      confirmPassword,
    });
    return response.data;
  },
};

// ============================================
// Users API (Profile & Favorites)
// ============================================
export const usersApi = {
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },

  getFavorites: async () => {
    const response = await api.get("/users/favorites");
    return response.data;
  },

  addFavorite: async (trailId) => {
    const response = await api.post(`/users/favorites/${trailId}`);
    return response.data;
  },

  removeFavorite: async (trailId) => {
    const response = await api.delete(`/users/favorites/${trailId}`);
    return response.data;
  },

  checkFavorite: async (trailId) => {
    const response = await api.get(`/users/favorites/${trailId}`);
    return response.data;
  },
};

// Function to set auth token for API requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
