import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faDollarSign,
  faList,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { useProductsContext } from "../hooks/useProductsContext";
import { FaImage } from "react-icons/fa6";
import { useParams } from "react-router-dom";

export const UpdateProduct = () => {
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    company: "",
    price: "",
    image: "",
  });
  const { dispatch } = useProductsContext();
  const { id } = useParams();

  const fetchProductById = async (productId) => {
    // Fetch logic here
    // This is a placeholder. Replace with actual API call
    const response = await fetch(
      `https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/products/${id}`,
      {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch product");
    }
  };

  useEffect(() => {
    // Fetch product data and set it to formData
    const fetchProductData = async () => {
      try {
        const productId = id; // Use the id from useParams
        const fetchedData = await fetchProductById(productId);
        setFormData(fetchedData);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProductData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // Update logic here
    const response = await fetch(
      `https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/products/update/${id}`,
      {
        method: "PUT",
        body: data,
      }
    );

    if (response.ok) {
      alert("Product updated successfully!");
      // Optionally, you can reset the form here
      // setFormData({ name: "", category: "", company: "", price: "", image: "" });
      // setPhoto(null);
    }
  };

  return (
    <div className="home">
      <h2 className="page-heading">Update Product</h2>
      <div className="add-product">
        <div className="flex items-center justify-center w-full">
          <h3>Media</h3>
          <label
            htmlFor="image-upload"
            className={
              photo ? "file-upload-label uploaded-label" : "file-upload-label"
            }
          >
            <div className="file-upload-content">
              {photo ? (
                <img
                  className="upload-icon uploaded-image"
                  src={URL.createObjectURL(photo)}
                  alt=""
                />
              ) : (
                <img
                  className="upload-icon uploaded-image"
                  src={formData.image}
                  alt=""
                />
              )}
            </div>
            <input
              id="image-upload"
              type="file"
              className="hidden"
              onChange={handleImageChange}
              name="image"
            />
          </label>
        </div>
        <div className="container">
          <h2>Basic Information</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Product Category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="company"
              placeholder="Product Company"
              value={formData.company}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Product Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <button type="submit">UPDATE</button>
          </form>
        </div>
      </div>
      <p>© All Rights Reserved by ♥ Hamid</p>
    </div>
  );
};
