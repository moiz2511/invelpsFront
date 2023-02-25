import React from "react";
import Logo from "../assets/logos/Original.svg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "../assets/images/icons8-menu-30.png";
import { Link } from "react-router-dom";
import "../assets/styles/Navbar.css";

const menuItemStyle = {
  width: "150px",
  color: "var(--primary-color)",
};
const achorStyle = { textDecoration: "none", color: "var(--primary-color)" };

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="navbar">
      <img src={Logo} alt="invelps" />
      <ul className="navbar-list">
        <a href="#home" style={achorStyle}>
          <li>Home</li>
        </a>
        <a href="#solutions" style={achorStyle}>
          <li>Solutions</li>
        </a>
        <a href="#applications" style={achorStyle}>
          <li>Applications</li>
        </a>
        <a href="#aboutus" style={achorStyle}>
          <li>About Us</li>
        </a>
        <Link to="/contact" style={achorStyle}>
          <li>Contact</li>
        </Link>
      </ul>
      <ul className="navbar-list navbar-list-second">
        <li>Login</li>
        <li>Sign Up</li>
      </ul>
      <div className="navbar-mobile-container">
        <img src={MenuIcon} alt="" onClick={handleClick} height="30" />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleClose} style={menuItemStyle}>
            <a href="#home" style={achorStyle}>
              <li>Home</li>
            </a>
          </MenuItem>
          <MenuItem onClick={handleClose} style={menuItemStyle}>
            <a href="#solutions" style={achorStyle}>
              <li>Solutions</li>
            </a>
          </MenuItem>
          <MenuItem onClick={handleClose} style={menuItemStyle}>
            <a href="#applications" style={achorStyle}>
              <li>Solutions</li>
            </a>
          </MenuItem>
          <MenuItem onClick={handleClose} style={menuItemStyle}>
            <a href="#aboutus" style={achorStyle}>
              <li>About Us</li>
            </a>
          </MenuItem>
          <MenuItem onClick={handleClose} style={menuItemStyle}>
            <Link to="/contact" style={achorStyle}>
              <li>Contact</li>
            </Link>
          </MenuItem>
          <MenuItem onClick={handleClose} style={menuItemStyle}>
            Login
          </MenuItem>
          <MenuItem onClick={handleClose} style={menuItemStyle}>
            Signup
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default Navbar;
