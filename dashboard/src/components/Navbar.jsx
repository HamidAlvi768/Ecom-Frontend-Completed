import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import '../App.css';

export const Navbar = () => {
  const auth = localStorage.getItem("token");
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <nav className="navbar">
      {auth ? (
        <>
          <ul className="nav-ul">
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/product">Uploaded Products</Link>
            </li>
            <li>
              <Link to="/">Product Upload</Link>
            </li>
            {/* <li><Link to="/profile">Profile</Link></li> */}
            <li>
              <Link onClick={logout} to="/signup">
                Logout
              </Link>
            </li>
          </ul>
        </>
      ) : (
        <>
          <ul className="nav-ul nav-right">
            <li>
              <Link to="/signup">Singup</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </>
      )}
    </nav>
  );
};
