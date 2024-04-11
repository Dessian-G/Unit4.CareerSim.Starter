import React, { useState, useEffect } from 'react';
//import {Link} from 'react-router-dom'
import "./Products.css";
//import { CartContext } from '../CartContext';
//import Products from './Pages/Shop';


const Products = () => {
    const [products, setProducts] = useState([]);
    //const { addToCart } = useContext(CartContext);'
    //const { id, name, description, price, image } = products;


    //const {product} = props;
    
    
    //const {addToCart} = useContext(CartContextContext);


    useEffect(() => {
        fetchProducts();
    }, []);
    //const {addToCart} = useContext(CartContext);
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
            <h2> All Products</h2>
          
            <ul>
                {products.map(product => (
                    <div key={product.id} className="product">
                        <h3>{product.name}</h3>
                    s          <p>Description: {product.description}</p>
                        <p>Price: ${product.price}</p>
                        <img src={product.image}></img>
                      <div> <button onClick={() => addToCart(product, id)}></button></div>
                        
                        
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default Products;


