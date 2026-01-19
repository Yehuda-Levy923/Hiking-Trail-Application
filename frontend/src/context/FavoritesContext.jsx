import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usersApi } from "../api/api";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Load favorites when user is authenticated
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites(new Set());
        return;
      }

      setLoading(true);
      try {
        const response = await usersApi.getFavorites();
        const favoriteIds = new Set(response.data.map((trail) => trail.id));
        setFavorites(favoriteIds);
      } catch (err) {
        console.error("Failed to load favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated]);

  const isFavorite = useCallback(
    (trailId) => {
      return favorites.has(trailId);
    },
    [favorites]
  );

  const addFavorite = useCallback(async (trailId) => {
    // Optimistic update
    setFavorites((prev) => new Set([...prev, trailId]));

    try {
      await usersApi.addFavorite(trailId);
    } catch (err) {
      // Rollback on error
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(trailId);
        return next;
      });
      throw err;
    }
  }, []);

  const removeFavorite = useCallback(async (trailId) => {
    // Optimistic update
    setFavorites((prev) => {
      const next = new Set(prev);
      next.delete(trailId);
      return next;
    });

    try {
      await usersApi.removeFavorite(trailId);
    } catch (err) {
      // Rollback on error
      setFavorites((prev) => new Set([...prev, trailId]));
      throw err;
    }
  }, []);

  const toggleFavorite = useCallback(
    async (trailId) => {
      if (favorites.has(trailId)) {
        await removeFavorite(trailId);
      } else {
        await addFavorite(trailId);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  const value = {
    favorites,
    loading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

export default FavoritesContext;
