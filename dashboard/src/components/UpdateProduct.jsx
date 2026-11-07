import { API_URL, apiFetch, assetUrl } from "../config";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const UpdateProduct = () => {
  const [photo, setPhoto] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    company: "",
    price: "",
    image: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const { name, category, company, price, image } = await response.json();
        setFormData({ name, category, company, price, image });
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
      // Only send the image when a new file was picked
      if (key === "image" && !(formData.image instanceof File)) return;
      data.append(key, formData[key]);
    });

    const response = await apiFetch(`/products/update/${id}`, {
      method: "PUT",
      body: data,
    });
    const result = await response.json().catch(() => ({}));
    if (response.ok) {
      alert("Product updated successfully!");
      navigate("/product");
    } else {
      alert(result.message || "Could not update the product");
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
                  src={assetUrl(formData.image)}
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
