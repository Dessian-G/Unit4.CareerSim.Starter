import React, { useState, useEffect } from "react";

//import api from api

import "./App.css";
import Navigation from "./components/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Products from "./components/Products";
import Shop from "./components/Shop";
import ProductId from "./components/ProductId";
import SingleProduct from "./components/SingleProduct";
import Cart_products from "./components/Cart_products";
import Cart from "./components/Cart";

//import ProductContext  from './Components/ProductContext';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/products" element={<Products />} />
          <Route path="/productId" element={<ProductId />} />

          <Route path="/cart_products" element={<Cart_products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/singleProduct" element={<SingleProduct />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
