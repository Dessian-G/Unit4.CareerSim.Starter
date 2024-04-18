import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.png";
import cart_icon from "../assets/cart_icon.png";

const Navbar = () => {
    const [menu, setMenu] = useState("Shop");
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle search submission
        console.log("Searching for:", searchTerm);
    };

    return (
        <nav>
            <div className="navbar">
                <div className="nav-logo">
                    <img src={logo} alt="" />
                    <p>DESSHOP</p>
                </div>
                <ul className="nav-menu">
                    <li onClick={() => { setMenu("shop") }}><Link to='/' style={{ textDecoration: 'none' }}>Shop</Link>{menu === "shop" ? <hr /> : <></>}</li>
                    <li onClick={() => { setMenu("shop") }}><Link to='/products' style={{ textDecoration: 'none' }}>Products</Link>{menu === "products" ? <hr /> : <></>}</li>
                    <li onClick={() => { setMenu("mens") }}><Link to='/mens' style={{ textDecoration: 'none' }}>Men</Link>{menu === "mens" ? <hr /> : <></>}</li>
                    <li onClick={() => { setMenu("womens") }}><Link to='/womens' style={{ textDecoration: 'none' }}>Women</Link>{menu === "womens" ? <hr /> : <></>}</li>
                </ul>
                <div className="nav-search">
                    <form onSubmit={handleSubmit}>
                        <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search products..." />
                        <button type="submit">Search</button>
                    </form>
                </div>
                <div className="nav-login-cart">
                    <Link to="/login"> <button>Login</button></Link>
                    <Link to="/cart"><img src={cart_icon} alt="" /></Link>
                    <div className="nav-cart-count">0</div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
