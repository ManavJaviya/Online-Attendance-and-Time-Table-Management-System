import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Attendance System</h2>
        </div>
        <div className="navbar-menu">
          <button className="navbar-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
