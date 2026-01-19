import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

export default function FavoriteButton({ trailId, size = "medium" }) {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const favorited = isFavorite(trailId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      await toggleFavorite(trailId);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeStyles = {
    small: {
      width: "32px",
      height: "32px",
      iconSize: "16px",
    },
    medium: {
      width: "40px",
      height: "40px",
      iconSize: "20px",
    },
    large: {
      width: "48px",
      height: "48px",
      iconSize: "24px",
    },
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        style={{
          width: currentSize.width,
          height: currentSize.height,
          borderRadius: "50%",
          border: "none",
          background: favorited ? "var(--bg-gradient-1)" : "white",
          cursor: isLoading ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          boxShadow: favorited
            ? "0 4px 12px rgba(45, 80, 22, 0.4)"
            : "0 2px 8px rgba(0, 0, 0, 0.1)",
          transform: isLoading ? "scale(0.95)" : "scale(1)",
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = "scale(1.1)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = isLoading ? "scale(0.95)" : "scale(1)";
        }}
      >
        {isLoading ? (
          <svg
            width={currentSize.iconSize}
            height={currentSize.iconSize}
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={favorited ? "white" : "var(--forest-green)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="32"
              strokeDashoffset="32"
            />
          </svg>
        ) : (
          <svg
            width={currentSize.iconSize}
            height={currentSize.iconSize}
            viewBox="0 0 24 24"
            fill={favorited ? "white" : "none"}
            stroke={favorited ? "white" : "var(--forest-green)"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )}
      </button>

      {/* Tooltip for non-authenticated users */}
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
            background: "var(--text-primary)",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            whiteSpace: "nowrap",
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          Log in to save favorites
          <div
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid var(--text-primary)",
            }}
          />
        </div>
      )}
    </div>
  );
}
