import React from "react";
import "./Hero.css";
import men_banner2 from "../assets/men_banner2.jpg";
import lady2_icon from "../assets/lady2_icon.jpg";
import maro from "../assets/maro.jpg"


const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h2>NEW <PRODUCTS></PRODUCTS></h2>
        <div>
          <div className="hero-lady2-icon">
            <p>new</p>
            <img src={men_banner2} alt="" />
          </div>
          <p>collections</p>
          <p>for everyone</p>
        </div>
        <div className="hero-latest-btn">
          <div>Latest Collection</div>
          <img src={lady2_icon} alt="" />
        </div>
      </div>
      <div className="hero-right">
        <img src={maro} alt="hero" />
      </div>
    </div>
  );
};

export default Hero;
