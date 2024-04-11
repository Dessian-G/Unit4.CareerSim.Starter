import React, { useState, useEffect } from 'react';
import "./Products.css";
//import { ShopContext } from "../ShopContext"

const Products = () => {
    const [products, setProducts] = useState([]);

    //const {product} = props;
    //const {addToCart} = useContext(ShopContext);


    useEffect(() => {
        fetchProducts();
    }, []);
    //const {addToCart} = useContext(ShopContext);
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
            <h2>Update Cart</h2>
            <ul>
                {products.map(product => (
                    <div key={product.id} className="product">
                        <h3>{product.name}</h3>
                        <p>Description: {product.description}</p>
                        <p>Price: ${product.price}</p>
                        <img src={product.image}></img>
                        <button onClick={() => { addToCart(product.id) }}>ADD TO CART</button>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default Products;


