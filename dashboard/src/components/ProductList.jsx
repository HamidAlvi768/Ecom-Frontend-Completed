import { API_URL, apiFetch, assetUrl } from "../config";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const ProductList = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    const response = await apiFetch(`/products/delete/${product._id}`, { method: 'DELETE' });
    if (!response.ok) alert('Could not delete the product');
    fetchProducts();
  };

  const searchProduct = async (e) => {
    const search = e.target.value.trim();
    if (!search) {
      fetchProducts();
      return;
    }
    const result = await fetch(`${API_URL}/search/${encodeURIComponent(search)}`);
    setProducts(await result.json());
  };

  return (
    <div className="product-list">
      <h1 className="page-heading">Product List</h1>
      <input onChange={searchProduct} type="text" placeholder="Search products..." />
      <div className="table-container">
        {products.length > 0 ?
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Company</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                <img
                  src={assetUrl(product.image)}
                  alt={product.name}
                  className="product-image"
                />
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.company}</td>
              <td>${product.price}</td>

              <td>
                <Link to={`/update-product/${product._id}`}>Update</Link>
                <button onClick={() => deleteProduct(product)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      : <h1>No Products Found</h1>}
      </div>
    </div>
  );
};
