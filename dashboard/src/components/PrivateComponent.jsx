import { apiFetch } from "../config";
import React, { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'

// Dashboard pages need a logged-in admin. Checks the saved token with the backend.
export const PrivateComponent = () => {
  const [error, setError] = useState(null);
  const auth = localStorage.getItem('token');

  useEffect(() => {
    if (!auth) return;
    // apiFetch sends the user to /login on 401/403
    apiFetch('/me')
      .then((res) => res.json())
      .then(({ user }) => {
        if (user?.role !== 'admin') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      })
      .catch((err) => {
        if (err.message !== 'Not authorized') setError('Cannot reach the server. Is the backend running?');
      });
  }, [auth]);

  if (error) {
    return <div style={{ padding: 40, textAlign: 'center' }}>{error}</div>;
  }

  return auth ? <Outlet /> : <Navigate to='/login' />
}
