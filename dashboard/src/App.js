import React from 'react';
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {Navbar} from './components/Navbar';
import {Home} from './components/Home';
import {ProductList} from './components/ProductList';
import {UpdateProduct} from './components/UpdateProduct';
import {Dashboard} from './components/Dashboard';
import {Login} from './components/Login';
import { PrivateComponent } from './components/PrivateComponent';
import {MyOrder} from './components/Orders';

// Admin accounts only. There is no signup here: customers sign up in the store,
// and an account is made an admin with `npm run make-admin -- <email>` in the backend.
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route element={<PrivateComponent />} >
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<ProductList />} />
            <Route path="/update-product/:id" element={<UpdateProduct />} />
            <Route path="/orders" element={<MyOrder />} />
            <Route path="/dashboard" element={<Dashboard />}/>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
