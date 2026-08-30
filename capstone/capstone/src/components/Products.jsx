import React, { useState, useEffect } from 'react';
import "./Products.css";

export const Products = () => {
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
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addToCart = async (productId) => {
        const token = localStorage.getItem('auth-token');
        if (!token) {
            alert('Please log in to add items to your cart.');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/cart_products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify({ productId }),
            });
            if (!response.ok) {
                throw new Error('Error adding product to cart');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
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
                        <img src={product.image}></img>
                        <button onClick={() => addToCart(product.id)}>ADD TO CART</button>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default Products;
