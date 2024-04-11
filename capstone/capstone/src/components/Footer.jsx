import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
function Footer() {
  return (
    <div className="footer">
    Copyright &copy; Desshop 2024. All rights reserved. &nbsp; <span className="footer__heart"></span> &nbsp; by
      Dessian. Get Code on &nbsp;
      <Link
        to={`https://github.com/Dessian-G/Unit4.CareerSim.Starter/tree/main/capstone/capstone`}
        style={{ fontSize: "14px" }}
      >
        GITHUB
      </Link>
    </div>
  );
}

export default Footer;