import React, { useContext } from "react";
import "./ProductDisplay.css";
//import star_icon from "../Assets/star_icon.png";
//import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../ShopContext";

const ProductDisplay = (props) => {

  const {product} = props;
  const {addToCart} = useContext(ShopContext);

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="img" />
        
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt="img" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">${product.price}</div>
         
        </div>
        <div className="productdisplay-right-description">
          A lightweight, usually knitted, pullover shirt, close-fitting and with
          a round neckline and short sleeves, worn as an undershirt or outer
          garment.
        </div>
       
       
        <button onClick={()=>{addToCart(product.id)}}>ADD TO CART</button>
        <p className="productdisplay-right-category"><span>Category :</span> electronic, women's clothing,men's clothing </p>
        <p className="productdisplay-right-category"><span>Tags :</span> Modern, Latest</p>
      </div>
    </div>
  );
};

export default ProductDisplay;
