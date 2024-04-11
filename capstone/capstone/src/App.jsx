//import React from "react";
import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//import "./index.css";
import Navbar from "./components/Navbar";
import "./App.css";
import Footer from "./components/Footer";
import Cart from "./components/Pages/Cart";
import Shop from "./components/Pages/Shop";
import ShopCategory from "./components/Pages/ShopCategory";
import Products from "./components/Products";
import LoginRegister from "./components/Pages/LoginRegister";
import women_banner from "./assets/lady2_icon.jpg"
import men_banner from "./assets/men_banner2.jpg"

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Shop gender="products" />} />
          <Route path="/mens" element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path="/womens" element={<ShopCategory banner={women_banner} category="women" />} />
          
          <Route path='/products' element={<Products gender="products"/>}>
            <Route path=':productId' element={<Products />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginRegister/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
