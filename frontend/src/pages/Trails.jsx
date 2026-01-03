import { useCallback } from "react";
import { trailsApi } from "../api/api";
import { useAsync } from "../hooks/useAsync";
import TrailCard from "../components/TrailCard";
import RefreshButton from "../components/RefreshButton";
import Loading from "../components/Loading";
import Error from "../components/Error";

export default function Trails() {
  const fetchTrails = useCallback(() => trailsApi.getAll(), []);
  const { data, loading, error, execute: refetch } = useAsync(fetchTrails, []);

  const trails = data?.data || [];

  if (loading && !data) {
    return (
      <div className="container">
        <Loading message="Loading trails..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Error message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Hiking Trails</h1>
        <p>Browse all available trails and check their current traffic conditions.</p>
      </div>

      <div className="action-bar">
        <span style={{ color: "#718096" }}>
          {trails.length} trail{trails.length !== 1 ? "s" : ""} available
        </span>
        <RefreshButton onRefresh={refetch} size="small" />
      </div>

      {trails.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3>No trails found</h3>
          <p>Check back later for new hiking trails.</p>
        </div>
      ) : (
        trails.map((trail) => <TrailCard key={trail.id} trail={trail} />)
      )}
    </div>
  );
}
