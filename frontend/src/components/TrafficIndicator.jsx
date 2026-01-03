const TRAFFIC_LABELS = {
  1: "Very Low",
  2: "Low",
  3: "Moderate",
  4: "High",
  5: "Very High",
};

const TRAFFIC_DESCRIPTIONS = {
  1: "Trail is nearly empty - perfect for a peaceful hike!",
  2: "Light traffic - comfortable hiking conditions.",
  3: "Moderate traffic - expect to encounter other hikers.",
  4: "High traffic - popular spot, consider off-peak hours.",
  5: "Very crowded - expect delays and limited parking.",
};

export default function TrafficIndicator({ level, updatedAt }) {
  const safeLevel = Math.min(Math.max(level || 1, 1), 5);

  const formatTime = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="traffic-indicator">
      <div className={`traffic-bar traffic-level-${safeLevel}`}></div>

      <div className="traffic-info">
        <h3>Current Traffic</h3>
        <div className={`traffic-level-text level-${safeLevel}`}>
          {TRAFFIC_LABELS[safeLevel]}
        </div>
        <p style={{ fontSize: "0.9rem", color: "#718096", marginTop: "4px" }}>
          {TRAFFIC_DESCRIPTIONS[safeLevel]}
        </p>
        {updatedAt && (
          <div className="traffic-updated">
            Updated: {formatTime(updatedAt)}
          </div>
        )}
      </div>
    </div>
  );
}
