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

export const ProductForm = ({ initialData, onSubmit, submitButtonText }) => {
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState(initialData);
  const { dispatch } = useProductsContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    await onSubmit(data);
  };

  return (
    <div className="home"> 
      <h1 className="page-heading">Product Upload</h1>
    <div className="add-product">
        <div className="flex items-center justify-center w-full">
          <h3>Media</h3>
          {" "}
          <label htmlFor="image-upload" className={photo ? 'file-upload-label uploaded-label' : 'file-upload-label'}>
            {" "}
            <div className="file-upload-content">
              {" "}
              {photo ?  <img className="upload-icon uploaded-image" src={URL.createObjectURL(photo)} alt="" /> : <FaImage className="upload-icon" />} {" "}
            </div>{" "}
            <input id="image-upload" type="file" className="hidden" onChange={handleImageChange} name="image" />{" "}
          </label>{" "}
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

          <button type="submit">{submitButtonText}</button>
        </form>
      </div>
    </div>
    <p>© All Rights Reserved by ♥ Hamid</p>
    </div>
  );
};

export const Home = () => {
  const initialData = {
    name: "",
    category: "",
    company: "",
    price: "",
    image: "",
  };

  const handleSubmit = async (data) => {
    const response = await fetch("https://merry-moxie-6d2ca1.netlify.app/.netlify/functions/api/add", {
      method: "POST",
      body: data,
    });

    if (response.ok) {
      alert("Product added successfully!");
    }
  };

  return <ProductForm initialData={initialData} onSubmit={handleSubmit} submitButtonText="PUBLISH" />;
};
