import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header({ fullwidth = false }) {

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);


  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div
      className="header"
      style={{
        width: fullwidth ? "100%" : `calc(100% - 260px)`,
        left: fullwidth ? "0px" : "260px",
      }}
    >
      <div className="logo">
        <Link to="/">
          <img src="public/assets/images/logo2.png" alt="Logo" />
        </Link>
      </div>
      <div className="navigation">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </div>
      <div className="icons">
        <div className="profile">
          <img src="public/assets/images/user.png" alt="Profile" />
          <div className="dropdown-menu">
            <Link to="/login">
              <a href="#">Login</a>
            </Link>
            {isLoggedIn && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <a href="#" onClick={handleLogout}>
                  Logout
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
