import React from 'react';
import './Navbar.css';
import MobiImage from './Mobi.png';
import {Link} from "react-router-dom";

// Define a functional component called Navbar
const Navbar = () => {
    return (
        // Create a navigation bar with the "navbar" class
        <nav className="navbar">
            <a className="backHome" href="/">
                <img src={MobiImage} alt="Mobi" height={80} width={80} />
            </a>

            <div className="links_container">
                <Link to="/" className="links">Home</Link>
                <Link to="/report" className="links">Report</Link>
            </div>
        </nav>
    );
}

export default Navbar;