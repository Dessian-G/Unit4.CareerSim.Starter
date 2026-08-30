import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../Pages/Cart.css";
import { fetchCartProducts, removeFromCart } from "../../utils/cart";

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('auth-token')) {
      navigate('/login');
      return;
    }
    fetchCartProducts().then((data) => {
      if (data) {
        setCartProducts(data);
      }
    });
  }, [navigate]);

  const handleRemove = async (cartItemId) => {
    const removed = await removeFromCart(cartItemId);
    if (removed) {
      setCartProducts((prev) => prev.filter((product) => product.id !== cartItemId));
    }
  };

  const getTotalCartAmount = () => {
    return cartProducts
      .reduce((total, product) => total + product.price * product.qty, 0)
      .toFixed(2);
  };

  const checkout = () => {
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
            <p>Quantity: {product.qty}</p>
            <img src={product.image} alt={product.name} />
            <button onClick={() => handleRemove(product.id)}>Remove from Cart</button>
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
