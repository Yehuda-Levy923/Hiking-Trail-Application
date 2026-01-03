import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link className="navbar-brand" to="/">
          <span style={{ fontSize: "1.5rem" }}>🏔️</span>
          <span style={{ fontWeight: "800", letterSpacing: "0.5px" }}>TrailWatch</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" style={({ isActive }) => ({
            background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
            padding: "8px 16px",
            borderRadius: "20px",
            transition: "all 0.3s ease"
          })}>
            🏠 Home
          </NavLink>
          <NavLink to="/trails" style={({ isActive }) => ({
            background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
            padding: "8px 16px",
            borderRadius: "20px",
            transition: "all 0.3s ease"
          })}>
            🥾 Trails
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
