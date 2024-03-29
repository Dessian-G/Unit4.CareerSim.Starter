import React, { useState } from 'react';

const ProductId = () => {
  const [productId, setProductId] = useState('');
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setProductId(event.target.value);
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProductData(data);
      setError('');
    } catch (error) {
      setError(error.message);
      setProductData(null);
    }
  };

  return (
    <div>
      <label htmlFor="productId">Product ID:</label>
      <input
        type="text"
        id="productId"
        value={productId}
        onChange={handleChange}
      />
      <button onClick={fetchProductData}>Fetch Product</button>
      {error && <p>{error}</p>}
      {productData && (
        <div>
          <h2>{productData.name}</h2>
          <p>Description: {productData.description}</p>
          <p>Price: ${productData.price}</p>
          {/* Add more product details as needed */}
        </div>
      )}
    </div>
  );
};

export default ProductId;