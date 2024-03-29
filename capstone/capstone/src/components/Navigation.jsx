import React from "react";
import "./Navbar.css"
//import logo from "../assets/logo.png"
//import Cart_icon from "../assets/cart_icon.png"
const Navigation = () => {
    return (
      <div className="navbar">
        <div className="nav-logo">
            <img src= {logo} alt=""/>
            <p> Dessian Shop</p>

        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/register">Products</Link>
          </li>
          <li>
            <Link to="/login">Products</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/cart_products">Cart_products</Link>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
        <div className="nav-login-cart">
            <buton> Login</buton>

        </div>
      </div>
    );
  };
  
  export default Navigation;