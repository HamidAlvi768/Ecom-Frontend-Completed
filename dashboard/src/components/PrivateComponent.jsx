import React, { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Signup } from './Signup';
export const PrivateComponent = () => {
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/products", {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        setError('Token expired please login again');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('An error occurred while fetching products');
    }
  }

  const auth = localStorage.getItem('token');

  useEffect(() => {
    if (auth) {
      fetchProducts();
    }
  }, [auth]);

  if (error) {
    return <div>{error}</div>;
  }

  return auth ? <Outlet /> : <Navigate to='/signup' />
}
