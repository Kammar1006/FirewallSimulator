import React from 'react';
import "./navbar.css";

import assets from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar">

        <div className="navbarContainer">

            {/* Left Part */}
            <NavLink to="/" className="navbarContainerLeft">
                <img src={assets.flameIcon} alt="" className="navbarContainerLeftIcon" />

                <div className="navbarContainerLeftNameContainer">
                    <p className="navbarContainerLeftNameContainerText">ACL Firewall Manager</p>
                </div>
            </NavLink>

            {/* Right Part */}
            <div className="navbarContainerRight">
                <div className="navbarContainerRightContainer">
                    <NavLink to="/dashboard" className="navbarContainerRightContainerButtonOne">
                        <button className="navbarContainerRightContainerButtonOneBtn">Dashboard</button>
                    </NavLink>
                    <div className="navbarContainerRightContainerButtonTwo">
                        <button className="navbarContainerRightContainerButtonTwoBtn">Settings</button>
                    </div>
                    <NavLink to="/login" className="navbarContainerRightContainerButtonThree">
                        <button className="navbarContainerRightContainerButtonThreeBtn glow-on-hover">
                            <span>Logout</span>
                        </button>
                    </NavLink>
                </div>
            </div>

        </div>
        
    </div>
  )
}

export default Navbar