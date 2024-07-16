import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const auth = localStorage.getItem('token');
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/product">Product List</Link>
        </li>
        <li>
          <Link to="/update-product">Update Product</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
      </ul>
    </nav>
  );
};

