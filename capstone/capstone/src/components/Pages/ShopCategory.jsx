import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ShopCategory.css";
import { Link } from "react-router-dom";
import Item from "../Item";

const CATEGORY_LINKS = [
  { path: "/mens", label: "Men", value: "men's clothing" },
  { path: "/womens", label: "Women", value: "women's clothing" },
  { path: "/electronics", label: "Electronics", value: "electronics" },
];

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

  const categoryProducts = products.filter((item) => item.category === props.category);

  return (
    <div className="shopcategory">
      <img src={props.banner} className="shopcategory-banner" alt="" />
      <div className="shopcategory-indexSort">
        <p>
          Showing <span>{categoryProducts.length}</span> product{categoryProducts.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="shopcategory-products product-grid">
        {categoryProducts.map((item) => (
          <Item
            id={item.id}
            key={item.id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
      <div className="shopcategory-loadmore">
        <p>Explore more</p>
        <div className="shopcategory-loadmore-links">
          {CATEGORY_LINKS.filter((c) => c.value !== props.category).map((c) => (
            <Link key={c.path} to={c.path}>
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

ShopCategory.propTypes = {
  banner: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
};

export default ShopCategory;
