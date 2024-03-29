import React, { useState } from 'react';

const Cart_products = () => {
  const [userId, setUserId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateCart = async () => {
    try {
      const response = await fetch('/api/cart_products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, productId, quantity })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      setMessage(responseData.message);
    } catch (error) {
      console.error('Error updating cart:', error);
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Update Cart</h2>
      {message && <p>{message}</p>}
      <label htmlFor="userId">User ID:</label>
      <input
        type="text"
        id="userId"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <label htmlFor="productId">Product ID:</label>
      <input
        type="text"
        id="productId"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <label htmlFor="quantity">Quantity:</label>
      <input
        type="text"
        id="quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={handleUpdateCart}>Update Cart</button>
    </div>
  );
};

export default Cart_products;
