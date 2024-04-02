import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";
import cart_icon from "../assets/cart_icon.png";
const Navigation = () => {
  return (
    <nav>
      <div className="navbar">
        <div className="nav-logo">
          <img src={logo} alt="" />
          <p> DessShop</p>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/">Shop</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>

          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/cart_products">Cart_products</Link>
          </li>
        </ul>
        <div className="nav-login-cart">
          <Link to="/login">
            <buton> Login</buton>
          </Link>
          <Link to="/cart">
            <img src={cart_icon} alt="" />
          </Link>

          <div className="nav-cart-count">0</div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
