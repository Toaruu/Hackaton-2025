import React from 'react';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <img src={logo} alt="Trash Scan Logo" className="navbar__logo" />
      </div>
    </nav>
  );
};

export default Navbar;