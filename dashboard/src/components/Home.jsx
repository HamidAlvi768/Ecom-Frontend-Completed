import React, { useState } from 'react';
import { useProductsContext } from '../hooks/useProductsContext';
export const Home = () => {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFilePath, setUploadedFilePath] = useState('');
    const [name, setName] = useState("");
    const [price, setPrice] = useState(""); // Changed state variable name
    const [category, setCategory] = useState(""); // Changed state variable name
    const [company, setCompany] = useState(""); // Changed state variable name
    const [image, setImage] = useState("");
    const { dispatch } = useProductsContext();

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    };

    const onSubmit = async e => {
        // e.preventDefault();
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
        // const product = {
        //     name: e.target.name.value,
        //     price: e.target.price.value,
        //     image: uploadedFilePath
        // };

        try {
            const res = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, price, category, company, image:uploadedFilePath }),
            });
            const data = await res.json();
            console.log('Product added successfully:', data);
        } catch (err) {
            console.error('Error adding product:', err);
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    <input type="file" onChange={onChange} />
                    <label>{filename}</label>
                </div>
                <input type="submit" value="Upload" />
            </form>
            {uploadedFilePath && (
                <form onSubmit={onAddProduct}>
                  <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Product Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)} // Updated state variable name
        />
        <input
          type="text"
          placeholder="Product Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)} // Updated state variable name
        />
        <input
          type="text"
          placeholder="Product Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)} // Updated state variable name
        />
                    <input type="submit" value="Add Product" />
                </form>
            )}
        </div>
    );
};

