import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { authAPI } from "../services/api";

function Navbar({ darkMode, setDarkMode }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if API call fails
      navigate('/login');
    }
  };

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

        <div className="profile-dropdown-container" ref={dropdownRef}>
          <div
            className="profile-icon-wrapper"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <i className="fas fa-user"></i>
          </div>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link
                to="/profile"
                className="dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <i className="fas fa-id-card"></i> Profile Section
              </Link>
              <button
                className="dropdown-item logout-btn"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
