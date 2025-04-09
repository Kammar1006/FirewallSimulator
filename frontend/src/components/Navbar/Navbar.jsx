import React from 'react';
import "./navbar.css";

import assets from '../../assets/assets';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="navbar">

        <div className="navbarContainer">

            {/* Left Part */}
            <NavLink to="/" className="navbarContainerLeft">
                <img src={assets.icon} alt="" className="navbarContainerLeftIcon" />

                <div className="navbarContainerLeftNameContainer">
                    <p className="navbarContainerLeftNameContainerText">
                        Network Firewall Simulator
                    </p>
                </div>
            </NavLink>

            {/* Right Part */}
            {location.pathname !== '/login' && (
                <div className="navbarContainerRight">
                    <div className="navbarContainerRightContainer">
                        <div className="navbarContainerRightContainerButtonTwo">
                            <button className="navbarContainerRightContainerButtonTwoBtn">Settings</button>
                        </div>

                        <NavLink to="/tasks" className="navbarContainerRightContainerButtonTasks">
                            <button className="navbarContainerRightContainerButtonTasksBtn">Tasks</button>
                        </NavLink>

                        <NavLink to="/login" className="navbarContainerRightContainerButtonThree">
                            <button className="navbarContainerRightContainerButtonThreeBtn glow-on-hover">
                                <span>Logout</span>
                            </button>
                        </NavLink>
                    </div>
                </div>
            )}

        </div>
        
    </div>
  )
}

export default Navbar;