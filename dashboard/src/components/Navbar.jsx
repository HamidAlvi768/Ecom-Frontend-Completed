import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearLogin } from "../config";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  const auth = localStorage.getItem("token");
  const navigate = useNavigate();
  const logout = (e) => {
    e.preventDefault();
    clearLogin();
    navigate("/login");
  };
  return (
    <nav className="navbar">
      {auth ? (
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
          <li><Link to="/orders">Orders</Link></li>
          <li>
            <Link onClick={logout} to="/login">
              Logout
            </Link>
          </li>
          <li><ThemeToggle /></li>
        </ul>
      ) : (
        <ul className="nav-ul nav-right">
          <li>
            <Link to="/login">Admin Login</Link>
          </li>
          <li><ThemeToggle /></li>
        </ul>
      )}
    </nav>
  );
};
