import { useState } from "react";
import { trafficApi } from "../api/api";

export default function RefreshButton({ onRefresh, size = "normal" }) {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await trafficApi.refresh();
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`btn btn-secondary ${size === "small" ? "btn-sm" : ""}`}
      onClick={handleRefresh}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span>
          Refreshing...
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Refresh Traffic
        </>
      )}
    </button>
  );
}
