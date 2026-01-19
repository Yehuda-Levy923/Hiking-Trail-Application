import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, usersApi, setAuthToken } from "../api/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "hiking_trail_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on app startup
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        setAuthToken(token);
        try {
          const response = await authApi.me();
          setUser(response.data);
        } catch (err) {
          // Token invalid or expired
          localStorage.removeItem(TOKEN_KEY);
          setAuthToken(null);
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await authApi.login({ email, password });
      const { user, token } = response.data;

      localStorage.setItem(TOKEN_KEY, token);
      setAuthToken(token);
      setUser(user);

      return { success: true };
    } catch (err) {
      const message = err.message || "Login failed";
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (email, password, name) => {
    setError(null);
    try {
      const response = await authApi.register({ email, password, name });
      const { user, token } = response.data;

      localStorage.setItem(TOKEN_KEY, token);
      setAuthToken(token);
      setUser(user);

      return { success: true };
    } catch (err) {
      const message = err.message || "Registration failed";
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateUser = useCallback(async (profileData) => {
    setError(null);
    try {
      const response = await usersApi.updateProfile(profileData);
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.message || "Failed to update profile";
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
