import React from "react";
import "../../../../assets/styles/Footer.css";
import { Link } from "react-router-dom";
import Logo from "../../../../assets/logos/Original.svg";
import FacebookLogo from "../../../../assets/images/facebook.png";
import InstagramLogo from "../../../../assets/images/instagram.png";
import TwitterLogo from "../../../../assets/images/twitter.png";

const achorStyle = { textDecoration: "none", color: "var(--primary-color)" };

function Footer() {
  return (
    <div className="footer">
      <div className="footer-top">
        {/* <img src={Logo} alt="invelps" /> */}
        <ul className="footer-top-list">
          <Link to="/contact" style={achorStyle}>
            <li>Contact</li>
          </Link>
          <a href="#services" style={achorStyle}>
            <li>Terms of use</li>
          </a>
          <a href="#aboutus" style={achorStyle}>
            <li>Privacy Policy</li>
          </a>
        </ul>
        {/* <ul className="footer-top-list footer-top-list-second">
          <li>Term Of Use</li>
          <li>Privacy Policy</li>
        </ul> */}
      </div>
      <div className="footer-bottom">
        <img src={Logo} alt="invelps" />
        <div className="footer-bottom-container">
          <ul className="footer-bottom-list">
            <li>
              <img src={FacebookLogo} alt="facebook" />
            </li>
            <li>
              <img src={InstagramLogo} alt="instagram" />
            </li>
            <li>
              <img src={TwitterLogo} alt="twitter" />
            </li>
          </ul>
          <p style={{ color: "#fff" }}>Copyright @2022 All right reserved</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
