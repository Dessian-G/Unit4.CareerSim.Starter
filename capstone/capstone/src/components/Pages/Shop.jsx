import React, { useState, useEffect } from "react";
import "./Shop.css";




const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
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
      <h2> DesShop</h2>
     
     
        {products.map(product => (
           <div key={product.id} className="product">
            <h3>{product.name}</h3>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <img src= {product.image}></img>
            <button>Add to cart</button>
          </div>
        ))}
     
     
    </div>
  );
};

export default Products;