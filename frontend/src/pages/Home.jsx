import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { trafficApi } from "../api/api";

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    trafficApi.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="container">
      <div className="hero">
        <h1>🌲 TrailWatch</h1>
        <p>
          Discover real-time trail traffic and plan your perfect outdoor adventure!
          Skip the crowds and find your ideal hiking time.
        </p>
        <Link className="btn btn-primary" to="/trails" style={{ background: "white", color: "#2d5016", fontWeight: "700", position: "relative", zIndex: 2 }}>
          🥾 Explore Trails Now
        </Link>
      </div>

      {stats && (
        <div className="trail-stats" style={{ marginTop: "32px" }}>
          <div className="stat-card">
            <div className="stat-value">{stats.total_trails}</div>
            <div className="stat-label">🏔️ Trails Tracked</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.low_traffic}</div>
            <div className="stat-label">✅ Low Traffic</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.moderate_traffic}</div>
            <div className="stat-label">⚠️ Moderate Traffic</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.high_traffic}</div>
            <div className="stat-label">🔥 High Traffic</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: "64px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "16px", fontSize: "2rem" }}>✨ Why TrailWatch?</h2>
        <p style={{ color: "#7F8C8D", marginBottom: "32px", fontSize: "1.1rem" }}>Your ultimate companion for stress-free hiking</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginTop: "24px" }}>
          <div className="card">
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📊</div>
            <h3 style={{ marginBottom: "12px", fontSize: "1.3rem" }}>Real-Time Data</h3>
            <p style={{ lineHeight: "1.7" }}>Get up-to-the-minute traffic updates for all your favorite hiking trails.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🗺️</div>
            <h3 style={{ marginBottom: "12px", fontSize: "1.3rem" }}>Trail Details</h3>
            <p style={{ lineHeight: "1.7" }}>Explore difficulty levels, distances, elevations, and estimated times.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎯</div>
            <h3 style={{ marginBottom: "12px", fontSize: "1.3rem" }}>Plan Better</h3>
            <p style={{ lineHeight: "1.7" }}>Avoid crowds and discover the perfect time for your next adventure!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
