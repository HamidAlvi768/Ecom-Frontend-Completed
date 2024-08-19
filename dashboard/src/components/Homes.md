import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faDollarSign, faList, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useProductsContext } from '../hooks/useProductsContext';

export const Home = () => {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFilePath, setUploadedFilePath] = useState('');
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [image, setImage] = useState("");
  const { dispatch } = useProductsContext();

  const onChange = e => {
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file);

      try {
          const res = await fetch('http://localhost:5000/upload', {
              method: 'POST',
              body: formData
          });
          const data = await res.json();
          setUploadedFilePath(data.filePath);
          dispatch({ type: "CREATE_PRODUCT", payload: data });
          console.log('File uploaded successfully:', data);
      } catch (err) {
          console.error('Error uploading file:', err);
      }
  };

  const onAddProduct = async e => {
      e.preventDefault();
      try {
          const res = await fetch('http://localhost:5000/api/products', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name, price, category, company, image: uploadedFilePath }),
          });
          const data = await res.json();
          console.log('Product added successfully:', data);
      } catch (err) {
          console.error('Error adding product:', err);
      }
  };

  return (
      <div className="container">
          <form onSubmit={onSubmit}>
              <div>
                  <input type="file" onChange={onChange} />
                  <label>{filename}</label>
              </div>
              <input type="submit" value="Upload" />
          </form>
          {uploadedFilePath && (
              <form onSubmit={onAddProduct}>
                  <div className="row">
                      <h4>Product Details</h4>
                      <div className="input-group input-group-icon">
                          <input
                              type="text"
                              placeholder="Product Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                          />
                          <div className="input-icon">
                              <FontAwesomeIcon icon={faTag} />
                          </div>
                      </div>
                      <div className="input-group input-group-icon">
                          <input
                              type="number"
                              placeholder="Product Price"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                          />
                          <div className="input-icon">
                              <FontAwesomeIcon icon={faDollarSign} />
                          </div>
                      </div>
                      <div className="input-group input-group-icon">
                          <input
                              type="text"
                              placeholder="Product Category"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                          />
                          <div className="input-icon">
                              <FontAwesomeIcon icon={faList} />
                          </div>
                      </div>
                      <div className="input-group input-group-icon">
                          <input
                              type="text"
                              placeholder="Product Company"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                          />
                          <div className="input-icon">
                              <FontAwesomeIcon icon={faBuilding} />
                          </div>
                      </div>
                  </div>
                  <div className="row">
                      <h4>Terms and Conditions</h4>
                      <div className="input-group">
                          <input type="checkbox" id="terms" />
                          <label htmlFor="terms">
                              I accept the terms and conditions for signing up to this service, and hereby confirm I have read the privacy policy.
                          </label>
                      </div>
                  </div>
                  <input type="submit" value="Add Product" />
              </form>
          )}
      </div>
  );
};
