import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

const TRAFFIC_LABELS = {
  1: "Very Low",
  2: "Low",
  3: "Moderate",
  4: "High",
  5: "Very High",
};

export default function TrailCard({ trail }) {
  const {
    id,
    name,
    description,
    difficulty,
    length_km,
    estimated_time_hours,
    location,
    congestion_level,
  } = trail;

  const getDifficultyClass = (diff) => {
    const classes = {
      easy: "difficulty-easy",
      moderate: "difficulty-moderate",
      hard: "difficulty-hard",
      expert: "difficulty-expert",
    };
    return classes[diff] || "";
  };

  return (
    <div className="trail-card">
      <div className="trail-card-header">
        <h3 className="trail-title">{name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
          <FavoriteButton trailId={id} size="small" />
          {difficulty && (
            <span className={`difficulty-badge ${getDifficultyClass(difficulty)}`}>
              {difficulty}
            </span>
          )}
        </div>
      </div>

      <p className="trail-desc">{description}</p>

      <div className="trail-meta">
        {length_km && (
          <span className="trail-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
            </svg>
            {length_km} km
          </span>
        )}
        {estimated_time_hours && (
          <span className="trail-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {estimated_time_hours}h
          </span>
        )}
        {location && (
          <span className="trail-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {location}
          </span>
        )}
      </div>

      <div className="trail-card-footer">
        {congestion_level && (
          <div className={`traffic-badge traffic-badge-${congestion_level}`}>
            <span className={`traffic-dot traffic-dot-${congestion_level}`}></span>
            {TRAFFIC_LABELS[congestion_level]} Traffic
          </div>
        )}
        <Link to={`/trails/${id}`} className="btn btn-primary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
}
