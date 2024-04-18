import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../Pages/Cart.css";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch cart products from the API
  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/cart_products');
        if (!response.ok) {
          throw new Error('Error fetching cart products');
        }
        const data = await response.json();
        setCartProducts(data);
      } catch (error) {
        console.error('Error fetching cart products:', error);
      }
    };

    fetchCartProducts();
  }, []);

  // Function to remove a product from the cart
  const removeFromCart = (productId) => {
    const updatedCart = cartProducts.filter((product) => product.id !== productId);
    setCartProducts(updatedCart);
  };

  // Function to calculate the total cart amount
  const getTotalCartAmount = () => {
    return cartProducts.reduce((total, product) => total + product.price, 0).toFixed(2);
  };

  // Function to handle checkout
  const checkout = () => {
    // Implement your checkout logic here
    // For now, let's just navigate to the checkout page
    navigate("/checkout");
  };

  return (
    <div className="cart">
      <h2>Cart</h2>
      <ul>
        {cartProducts.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <img src={product.image} alt={product.name} />
            <button onClick={() => removeFromCart(product.id)}>Remove from Cart</button>
            <button onClick={() => navigate("/")}> Continue Shopping </button>
          </li>
        ))}
        
      </ul>

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={checkout}>Proceed to Checkout</button>
        </div>
        
        
      </div>
    </div>
  );
};

export default Cart;

