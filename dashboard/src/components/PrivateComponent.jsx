import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { Signup } from './Signup';

export const PrivateComponent = () => {
 const auth = localStorage.getItem('user');

  return auth? <Outlet />: <Navigate to='/signup' />
  
}
