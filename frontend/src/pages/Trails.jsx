import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { trailsApi } from "../api/api";
import { useAsync } from "../hooks/useAsync";
import TrailCard from "../components/TrailCard";
import RefreshButton from "../components/RefreshButton";
import SearchBar from "../components/SearchBar";
import DifficultyFilter from "../components/DifficultyFilter";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import Error from "../components/Error";

export default function Trails() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [difficultyFilter, setDifficultyFilter] = useState(searchParams.get("difficulty") || "");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page"), 10) || 1);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get("limit"), 10) || 10);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (difficultyFilter) params.set("difficulty", difficultyFilter);
    if (currentPage > 1) params.set("page", currentPage.toString());
    if (pageSize !== 10) params.set("limit", pageSize.toString());

    setSearchParams(params, { replace: true });
  }, [searchQuery, difficultyFilter, currentPage, pageSize, setSearchParams]);

  const fetchTrails = useCallback(() => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (difficultyFilter) filters.difficulty = difficultyFilter;

    return trailsApi.getAll(filters, { page: currentPage, limit: pageSize });
  }, [searchQuery, difficultyFilter, currentPage, pageSize]);

  const { data, loading, error, execute: refetch } = useAsync(fetchTrails, [searchQuery, difficultyFilter, currentPage, pageSize]);

  // Refetch when filters or pagination change
  useEffect(() => {
    refetch();
  }, [searchQuery, difficultyFilter, currentPage, pageSize, refetch]);

  const trails = data?.data || [];
  const totalTrails = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  const handleDifficultyChange = (value) => {
    setDifficultyFilter(value);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to page 1 when page size changes
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDifficultyFilter("");
    setCurrentPage(1);
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
          onChange={handleSearchChange}
          placeholder="Search by trail name or location..."
        />
        <DifficultyFilter
          value={difficultyFilter}
          onChange={handleDifficultyChange}
        />
      </div>

      <div className="action-bar">
        <span style={{ color: "#718096" }}>
          {totalTrails} trail{totalTrails !== 1 ? "s" : ""} {hasActiveFilters ? "found" : "available"}
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
        <>
          <div className="trails-list">
            {trails.map((trail) => <TrailCard key={trail.id} trail={trail} />)}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            totalItems={totalTrails}
          />
        </>
      )}
    </div>
  );
}
