import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usersApi } from "../api/api";
import TrailCard from "../components/TrailCard";

export default function Favorites() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Load favorites
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) return;

      setLoading(true);
      setError(null);

      try {
        const response = await usersApi.getFavorites();
        setFavorites(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h3>Error Loading Favorites</h3>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Favorite Trails</h1>
        <p>Your saved trails for quick access</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state" style={{
          background: "white",
          padding: "var(--spacing-2xl)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          textAlign: "center",
        }}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: "var(--spacing-lg)", opacity: 0.5 }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h3 style={{ marginBottom: "var(--spacing-md)", color: "var(--text-primary)" }}>
            No Favorite Trails Yet
          </h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "var(--spacing-lg)", maxWidth: "400px", margin: "0 auto var(--spacing-lg)" }}>
            Start exploring trails and click the heart icon to save your favorites for quick access later.
          </p>
          <Link to="/trails" className="btn btn-primary">
            Explore Trails
          </Link>
        </div>
      ) : (
        <>
          <p style={{
            marginBottom: "var(--spacing-lg)",
            color: "var(--text-muted)",
          }}>
            {favorites.length} {favorites.length === 1 ? "trail" : "trails"} saved
          </p>

          <div className="trails-list">
            {favorites.map((trail) => (
              <TrailCard key={trail.id} trail={{ ...trail, is_favorite: true }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
