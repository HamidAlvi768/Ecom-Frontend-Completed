import React from 'react';

export const UpdateProduct = () => {
  return (
    <div>
      <h1>Welcome to the Update Page</h1>
      <form>
        <div>
          <label>Product Name:</label>
          <input type="text" />
        </div>
        <div>
          <label>Product Price:</label>
          <input type="text" />
        </div>
        <div>
          <label>Product Category:</label>
          <input type="text" />
        </div>
        <div>
          <label>Product Company:</label>
          <input type="text" />
        </div>
        <button>Update</button>
      </form>
    </div>
  );
};

