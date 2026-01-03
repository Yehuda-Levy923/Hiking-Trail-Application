export default function Error({ message, onRetry }) {
  return (
    <div className="error-container">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c53030" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h3>Something went wrong</h3>
      <p>{message || "An unexpected error occurred. Please try again."}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
