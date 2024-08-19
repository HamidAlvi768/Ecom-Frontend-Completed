import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const ProductList = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const response = await fetch("https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/products",{
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    });
    const data = await response.json();
    setProducts(data);
    if (response.status === 401) {
      // setExpired(true);
    localStorage.removeItem('token');
          // navigate('/login'); // Redirect to login page
          throw new Error('Token expired');
        }

  };
  useEffect(() => {

    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    await fetch(`https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/products/delete/${id}`, {
      method: 'DELETE',
    });
    fetchProducts();
  };

  const searchProduct = async (e) => {
    let search = e.target.value;
    if(search){

      let result = await fetch(`https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/search/${search}`);
      result = await result.json();
      setProducts(result);
    }
    if (search === '') {
      fetchProducts();
    }
  };

  return (
    <div className="product-list">
      <h1 className="page-heading">Product List</h1>
      <input onChange={searchProduct} type="text" />
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
                  src={product.image}
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
                <button onClick={() => deleteProduct(product._id)}>Delete</button>
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
