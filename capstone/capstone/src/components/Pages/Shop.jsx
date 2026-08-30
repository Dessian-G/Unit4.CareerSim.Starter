import { useState, useEffect } from "react";
import "./Shop.css";
import Item from "../Item";
import hero from "../../assets/hero2.jpg";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shop-page">
      <section className="shop-hero">
        <img src={hero} alt="" className="shop-hero-image" />
        <div className="shop-hero-text">
          <h1>DesShop</h1>
          <p>Everyday essentials, curated for you.</p>
        </div>
      </section>

      <section className="shop-products">
        <h2>All products</h2>
        {loading ? (
          <p className="shop-status">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="shop-status">No products available yet.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
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
      </section>
    </div>
  );
};

export default Shop;
