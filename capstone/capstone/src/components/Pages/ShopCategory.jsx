import React, { useEffect, useState } from "react";
import "./ShopCategory.css";
import { Link } from "react-router-dom";
import Item from "../Item";

const ShopCategory = (props) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
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

    fetchInfo();
  }, []);

  return (
    <div className="shopcategory">
      <img src={props.banner} className="shopcategory-banner" alt="" />
      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1 - 6</span> out of 15 Products
        </p>
      </div>
      <div className="shopcategory-products">
        {products.map((item) => {
          if (props.category === item.category) {
            return (
              <Item
                id={item.id}
                key={item.id}
                name={item.name}
                image={item.image}
                price={item.price}
                
                
              />
            );
          } else {
            return null;
          }
        })}
      </div>
      <div className="shopcategory-loadmore">
        <Link to="/" style={{ textDecoration: "none" }}>
          Explore More
        </Link>
      </div>
    </div>
  );
};

export default ShopCategory;