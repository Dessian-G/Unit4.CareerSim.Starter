import React, { useState, useEffect } from 'react';
import "../Pages/Cart.css"
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart products from the API
  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/cart_products');
        if (!response.ok) {
          throw new Error('Error fetching cart products');
        }
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error('Error fetching cart products:', error);
      }
    };

    fetchCartProducts();
  }, []);

  // Function to remove an item from the cart
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
  };

  return (
    <div className="cart">
      <h2>Cart</h2>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            <h3>{item.name}</h3>
            <p>Description: {item.description}</p>
            <p>Price: ${item.price}</p>
            <button onClick={() => removeFromCart(item.id)}>Remove from Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
