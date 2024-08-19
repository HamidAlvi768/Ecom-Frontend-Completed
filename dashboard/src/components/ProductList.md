import React, { useState, useEffect } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
export const ProductList = () => {
  const [error, setError] = useState(null);

  const { products, dispatch } = useProductsContext();

  useEffect(() => {
    fetchProducts();
  }, []);

  const apiUrl = "http://localhost:5000/api/products";

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (response.ok) {
        dispatch({ type: "SET_PRODUCTS", payload: data });
      }
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      dispatch({ type: "DELETE_PRODUCT", payload: id });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err.message });
    }
  };
  return (
    <div className="product-details">
      <div>
        <input type="text" placeholder="Search for products" />
        <button>Search</button>
      </div>
      {error && <p>Error: {error}</p>}
      <h1>Product List</h1>
      <table className="product-table">
        <tbody>
          <tr>
            <th className="product-label">Image</th>
            <th className="product-label">Name</th>
            <th className="product-label">Price</th>
            <th className="product-label">Category</th>
            <th className="product-label">Company</th>
          </tr>
          {products &&
            products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    className="product-image"
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.company}</td>
                <td
                  className="x-button"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
