import { useState, useCallback, useEffect } from "react";
import { trailsApi } from "../api/api";
import { useAsync } from "../hooks/useAsync";
import TrailCard from "../components/TrailCard";
import RefreshButton from "../components/RefreshButton";
import SearchBar from "../components/SearchBar";
import DifficultyFilter from "../components/DifficultyFilter";
import Loading from "../components/Loading";
import Error from "../components/Error";

export default function Trails() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");

  const fetchTrails = useCallback(() => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (difficultyFilter) filters.difficulty = difficultyFilter;
    return trailsApi.getAll(filters);
  }, [searchQuery, difficultyFilter]);

  const { data, loading, error, execute: refetch } = useAsync(fetchTrails, [searchQuery, difficultyFilter]);

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [searchQuery, difficultyFilter, refetch]);

  const trails = data?.data || [];

  const handleClearFilters = () => {
    setSearchQuery("");
    setDifficultyFilter("");
  };

  const hasActiveFilters = searchQuery || difficultyFilter;

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

      <div className="filters-section">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by trail name or location..."
        />
        <DifficultyFilter
          value={difficultyFilter}
          onChange={setDifficultyFilter}
        />
      </div>

      <div className="action-bar">
        <span style={{ color: "#718096" }}>
          {trails.length} trail{trails.length !== 1 ? "s" : ""} {hasActiveFilters ? "found" : "available"}
        </span>
        <div className="action-bar-right">
          {hasActiveFilters && (
            <button onClick={handleClearFilters} className="btn btn-secondary btn-sm">
              Clear All Filters
            </button>
          )}
          <RefreshButton onRefresh={refetch} size="small" />
        </div>
      </div>

      {trails.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3>No trails found</h3>
          <p>{hasActiveFilters ? "Try adjusting your search or filters." : "Check back later for new hiking trails."}</p>
        </div>
      ) : (
        trails.map((trail) => <TrailCard key={trail.id} trail={trail} />)
      )}
    </div>
  );
}
