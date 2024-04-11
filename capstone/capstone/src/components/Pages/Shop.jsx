import React, { useState, useEffect } from "react";
import "./Shop.css";




const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error('Error fetching products');
      }
      const data = await response.json();
      console.log(data)
      setProducts(data);

    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="product-page">
      <h2> All Products</h2>
      <ul>
        {products.map(product => (
           <div key={product.id} className="product">
            <h3>{product.name}</h3>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <img src= {product.image}></img>
            <button>Add to cart</button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Products;