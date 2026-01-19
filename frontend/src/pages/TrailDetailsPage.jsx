import { useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { trailsApi, trafficApi } from "../api/api";
import { useAsync } from "../hooks/useAsync";
import TrafficIndicator from "../components/TrafficIndicator";
import RefreshButton from "../components/RefreshButton";
import FavoriteButton from "../components/FavoriteButton";
import Loading from "../components/Loading";
import Error from "../components/Error";

const DIFFICULTY_COLORS = {
  easy: "#38a169",
  moderate: "#d69e2e",
  hard: "#e53e3e",
  expert: "#805ad5",
};

export default function TrailDetailsPage() {
  const { id } = useParams();

  const fetchTrail = useCallback(() => trailsApi.getById(id), [id]);
  const fetchTraffic = useCallback(() => trafficApi.getByTrailId(id).catch(() => null), [id]);

  const { data: trailData, loading: trailLoading, error: trailError, execute: refetchTrail } = useAsync(fetchTrail, [id]);
  const { data: trafficData, execute: refetchTraffic } = useAsync(fetchTraffic, [id]);

  const trail = trailData?.data;
  const traffic = trafficData?.data;

  const handleRefresh = async () => {
    await refetchTrail();
    await refetchTraffic();
  };

  if (trailLoading) {
    return (
      <div className="container">
        <Loading message="Loading trail details..." />
      </div>
    );
  }

  if (trailError) {
    return (
      <div className="container">
        <Error message={trailError} onRetry={refetchTrail} />
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="container">
        <Error message="Trail not found" />
        <Link to="/trails" className="btn btn-secondary" style={{ marginTop: "16px" }}>
          Back to Trails
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="trail-detail-header">
        <Link to="/trails" style={{ color: "#2d6a4f", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "16px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Trails
        </Link>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", marginBottom: "var(--spacing-sm)" }}>
              <h1 style={{ margin: 0 }}>{trail.name}</h1>
              <FavoriteButton trailId={parseInt(id, 10)} size="large" />
            </div>
            {trail.location && (
              <div className="trail-location">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {trail.location}
              </div>
            )}
          </div>
          <RefreshButton onRefresh={handleRefresh} />
        </div>
      </div>

      <TrafficIndicator
        level={traffic?.congestion_level || trail.congestion_level}
        updatedAt={traffic?.updated_at || trail.traffic_updated_at}
      />

      <div className="trail-stats">
        {trail.difficulty && (
          <div className="stat-card">
            <div className="stat-value" style={{ color: DIFFICULTY_COLORS[trail.difficulty] }}>
              {trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)}
            </div>
            <div className="stat-label">Difficulty</div>
          </div>
        )}
        {trail.length_km && (
          <div className="stat-card">
            <div className="stat-value">{trail.length_km}</div>
            <div className="stat-label">Kilometers</div>
          </div>
        )}
        {trail.elevation_gain_m && (
          <div className="stat-card">
            <div className="stat-value">{trail.elevation_gain_m}</div>
            <div className="stat-label">Elevation (m)</div>
          </div>
        )}
        {trail.estimated_time_hours && (
          <div className="stat-card">
            <div className="stat-value">{trail.estimated_time_hours}</div>
            <div className="stat-label">Hours</div>
          </div>
        )}
      </div>

      <div className="trail-description-card">
        <h2>About This Trail</h2>
        <p>{trail.description || "No description available."}</p>
      </div>
    </div>
  );
}
