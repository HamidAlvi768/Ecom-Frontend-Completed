import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTag,
  faDollarSign,
  faList,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { useProductsContext } from "../hooks/useProductsContext";
import { FaImage } from "react-icons/fa6";

export const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    company: "",
    price: "",
    image: "",
  });
  const { dispatch } = useProductsContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("company", formData.company);
    data.append("image", formData.image);

    const response = await fetch("http://localhost:5000/api/products/add", {
      method: "POST",
      body: data,
    });

    if (response.ok) {
      setFormData({
        name: "",
        category: "",
        company: "",
        price: "",
        image: "",
      });
      alert("Product added successfully!");
    }
  };

  return (
    <div className="add-product">
      <h2>Add Product</h2>
      <div className="container">
        <div className="flex items-center justify-center w-full">
          {" "}
          <label htmlFor="image-upload" className="file-upload-label">
            {" "}
            <div className="file-upload-content">
              {" "}
              <FaImage className="upload-icon" />{" "}
            </div>{" "}
            <input id="image-upload" type="file" className="hidden" />{" "}
          </label>{" "}
        </div>
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
            name="company"
            placeholder="Product company"
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

          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};
