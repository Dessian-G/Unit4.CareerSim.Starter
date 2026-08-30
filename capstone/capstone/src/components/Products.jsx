import { useState, useEffect } from 'react';
import "./Products.css";
import Item from './Item';

export const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error('Error fetching products');
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="products-page">
            <h2>All Products</h2>
            {loading ? (
                <p className="products-status">Loading products…</p>
            ) : products.length === 0 ? (
                <p className="products-status">No products available yet.</p>
            ) : (
                <div className="product-grid">
                    {products.map(product => (
                        <Item
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            image={product.image}
                            price={product.price}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
