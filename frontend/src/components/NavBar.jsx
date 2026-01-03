import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link className="navbar-brand" to="/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
            <path d="M9 22v-4h6v4" />
          </svg>
          TrailWatch
        </Link>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/trails">Trails</NavLink>
        </div>
      </div>
    </nav>
  );
}
