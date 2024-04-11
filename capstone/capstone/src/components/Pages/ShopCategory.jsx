import React, { useEffect, useState } from "react";
import "./ShopCategory.css"
import { Link } from "react-router-dom";
//import drpb_icon from "../drpb_icon.png"
import Item from "../Item";


//import Item from "../Item";

const ShopCategory = (props) => {

    const [products, setProducts] = useState([]);
  
    const fetchInfo = () => { 
      fetch('http://localhost:3000/api/products') 
              .then((res) => res.json()) 
              .then((data) => setProducts(data))
      }
  
      useEffect(() => {
        fetchInfo();
      },
       [])
      
    return (
      <div className="shopcategory">
        <img src={props.banner} className="shopcategory-banner" alt="" />
        <div className="shopcategory-indexSort">
          <p><span>Showing 1 - 6</span> out of 15 Products</p>
          
        </div>
        <div className="shopcategory-products">
          {products.map((item,i) => {
              if(props.category===item.category)
              {
                return <Item id={item.id} key={i} name={item.name} image={item.image}  new_price={item.new_price} old_price={item.old_price}/>;
              }
              else
              {
                return null;
              }
          })}
        </div>
        <div className="shopcategory-loadmore">
        <Link to='/' style={{ textDecoration: 'none' }}>Explore More</Link>
        </div>
      </div>
    );
  };
  
  export default ShopCategory;
  