import { useState, useEffect } from 'react';
import "./Products.css";
import { addToCart } from '../utils/cart';

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
