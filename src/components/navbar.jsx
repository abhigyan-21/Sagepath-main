import { Link } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/homepage">Home</Link>
        <Link to="/luros">Courses</Link>
        <Link to="/community">Community</Link>
        <Link to="/about">About</Link>
      </div>

      <div className="nav-right">
        {/* Toggle icon switches between moon/sun */}
        <i
          className={`fas ${darkMode ? "fa-moon" : "fa-sun"}`}
          id="nav-icons"
          onClick={() => setDarkMode(!darkMode)}
        ></i>

        <Link to="/profile">
          <i className="fas fa-user"></i>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
