
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ProductProvider from './Product.Context';
import ShopContextProvider from './ShopContext';
import CartProvider from './CartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
  <ProductProvider>
   

   
  <React.StrictMode>
    <ShopContextProvider>
    <App />
    </ShopContextProvider>
 
  </React.StrictMode>
  </ProductProvider>
  </CartProvider>
);

