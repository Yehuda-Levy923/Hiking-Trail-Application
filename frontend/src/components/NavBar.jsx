import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkStyle = (isActive) => ({
    background: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
    padding: "8px 16px",
    borderRadius: "20px",
    transition: "all 0.3s ease"
  });

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link className="navbar-brand" to="/">
          <span style={{ fontSize: "1.5rem" }}>🏔️</span>
          <span style={{ fontWeight: "800", letterSpacing: "0.5px" }}>TrailWatch</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" style={({ isActive }) => navLinkStyle(isActive)}>
            🏠 Home
          </NavLink>
          <NavLink to="/trails" style={({ isActive }) => navLinkStyle(isActive)}>
            🥾 Trails
          </NavLink>

          {isAuthenticated ? (
            <>
              <span className="nav-user">
                👤 {user?.name}
              </span>
              <button onClick={handleLogout} className="nav-logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={({ isActive }) => navLinkStyle(isActive)}>
                Login
              </NavLink>
              <NavLink to="/register" style={({ isActive }) => navLinkStyle(isActive)}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
