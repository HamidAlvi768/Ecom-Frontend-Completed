import React from 'react';
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {Navbar} from './components/Navbar';
import {Home} from './components/Home';
import {ProductList} from './components/ProductList';
import {UpdateProduct} from './components/UpdateProduct';
import {Dashboard} from './components/Dashboard';
import {Login} from './components/Login';
import {Signup} from './components/Signup';
import { ProductsContextProvider } from './context/ProductsContext';
import { PrivateComponent } from './components/PrivateComponent';


function App() {
  return (
    <ProductsContextProvider>
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route element={<PrivateComponent />} >
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/update-product/:id" element={<UpdateProduct />} />
          <Route path="/dashboard" element={<Dashboard />}/>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
    </ProductsContextProvider>
  );
}

export default App;
