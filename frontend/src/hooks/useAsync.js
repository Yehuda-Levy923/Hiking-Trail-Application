import { useState, useEffect, useCallback } from "react";

/**
 * Generic async data fetching hook
 */
export function useAsync(asyncFunction, dependencies = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
}

/**
 * Hook for data that needs periodic refresh
 */
export function usePolling(asyncFunction, interval = 30000, enabled = true) {
  const { data, loading, error, execute } = useAsync(asyncFunction, [], enabled);

  useEffect(() => {
    if (!enabled || interval <= 0) return;

    const id = setInterval(execute, interval);
    return () => clearInterval(id);
  }, [execute, interval, enabled]);

  return { data, loading, error, refresh: execute };
}

/**
 * Debounce hook for search inputs
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
