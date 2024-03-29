import { useState } from 'react'

import './App.css'
import Navigation from './components/Navigation';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
//import Cart_products from './components/Cart_products';
import Login from './components/Login';
import Register from './components/Register';
import Products from './components/Products';
import Home from './components/Home';
import ProductId from './components/ProductId';
import Cart_products from './components/Cart_products';




function App() {
  
  return (
   
      <div>
        <Router>
       <Navigation/>
       <Routes>
       <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/productId" element={<ProductId />} />
        <Route path="/cart_products" element={<Cart_products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
       </Routes>
       </Router>
      </div>
      
  )
}

export default App
