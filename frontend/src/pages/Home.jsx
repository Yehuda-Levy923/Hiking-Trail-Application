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
        <h1>🥾 TrailWatch</h1>
        <p>
          Real-time trail traffic information to help you plan the perfect hike.
          Check current conditions before you go.
        </p>
        <Link className="btn btn-primary" to="/trails" style={{ background: "#fff", color: "#1b4332" }}>
          Explore Trails
        </Link>
      </div>

      {stats && (
        <div className="trail-stats" style={{ marginTop: "32px" }}>
          <div className="stat-card">
            <div className="stat-value">{stats.total_trails}</div>
            <div className="stat-label">Trails Tracked</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.low_traffic}</div>
            <div className="stat-label">Low Traffic</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.moderate_traffic}</div>
            <div className="stat-label">Moderate Traffic</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.high_traffic}</div>
            <div className="stat-label">High Traffic</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: "48px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "16px" }}>Why TrailWatch?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", marginTop: "24px" }}>
          <div className="card">
            <h3 style={{ color: "#2d6a4f", marginBottom: "8px" }}>📊 Real-Time Data</h3>
            <p>Get up-to-date traffic information for popular hiking trails.</p>
          </div>
          <div className="card">
            <h3 style={{ color: "#2d6a4f", marginBottom: "8px" }}>🗺️ Trail Details</h3>
            <p>View difficulty, distance, and estimated hiking times.</p>
          </div>
          <div className="card">
            <h3 style={{ color: "#2d6a4f", marginBottom: "8px" }}>🎯 Plan Better</h3>
            <p>Avoid crowds and find the perfect time to hit the trails.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
