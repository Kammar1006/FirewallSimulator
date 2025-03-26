import React from 'react';
import "./login.css";
import assets from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Login = () => {
  return (
    <div className="login">

        <div className="loginContainer">

            <div className="loginContainerElement">

                {/* Top Part */}
                <div className="loginContainerElementTop">
                    <div className="loginContainerElementTopIcon">
                        <img src={assets.shieldIcon} alt="" className="loginContainerElementTopIconElement" />
                    </div>

                    <div className="loginContainerElementTopTextEle">
                        <p className="loginContainerElementTopTextEleText">
                            ACL Firewall Manager
                        </p>
                    </div>
                </div>




                {/* Bottom Part */}
                <div className="loginContainerElementBottom">

                    <div className="loginContainerElementBottomContainer">
                        {/* Top Part */}
                        <div className="loginContainerElementBottomContainerTop">
                            <p className="loginContainerElementBottomContainerTopText">
                                Login
                            </p>
                        </div>

                        {/* Middle Part */}
                        <div className="loginContainerElementBottomContainerMiddle">
                            {/* Username Element */}
                            <div className="loginContainerElementBottomContainerMiddleUsername">
                                <div className="loginContainerElementBottomContainerMiddleUsernameContainer">
                                    <p className="loginContainerElementBottomContainerMiddleUsernameContainerText">
                                        Username
                                    </p>

                                    <input type="text" placeholder="Enter your username" className="loginContainerElementBottomContainerMiddleUsernameContainerInput" />
                                </div>
                            </div>

                            {/* Password Element */}
                            <div className="loginContainerElementBottomContainerMiddlePassword">
                                <div className="loginContainerElementBottomContainerMiddlePasswordContainer">
                                    <p className="loginContainerElementBottomContainerMiddlePasswordContainerText">
                                        Password
                                    </p>

                                    <input type="password" placeholder="Enter your password" className="loginContainerElementBottomContainerMiddlePasswordContainerInput" />
                                </div>
                            </div>
                        </div>





                        {/* Bottom Part */}
                        <div className="loginContainerElementBottomContainerBottom">
                            <div className="loginContainerElementBottomContainerBottomContainer">
                                
                                <div className="loginContainerElementBottomContainerBottomContainerRemember">
                                    <input type="checkbox" className="loginContainerElementBottomContainerBottomContainerRememberInput" />
                                    <p className="loginContainerElementBottomContainerBottomContainerRememberText">
                                        Remember me
                                    </p>
                                </div>

                                
                                <NavLink to="/" className="loginContainerElementBottomContainerBottomContainerLogin">
                                        <div className="loginContainerElementBottomContainerBottomContainerLoginBtn">
                                            <p className="loginContainerElementBottomContainerBottomContainerLoginText">
                                                Login
                                            </p>
                                        </div>
                                    </NavLink>

                                <div className="loginContainerElementBottomContainerBottomContainerForgot">
                                    <NavLink to="/" className="loginContainerElementBottomContainerBottomContainerForgotNav">
                                        <p className="loginContainerElementBottomContainerBottomContainerForgotNavText">
                                            Forgot Password?
                                        </p>
                                    </NavLink>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>


            {/* Bottom Info Container */}
            <div className="loginContainerBottomPart">
                <div className="loginContainerBottomPartContainer">
                    <NavLink to="/" className="loginContainerBottomPartContainerText">Contact Support</NavLink>
                    <div className="loginContainerBottomPartContainerHrDivElement" />
                    <NavLink to="/"  className="loginContainerBottomPartContainerText">Privacy Policy</NavLink>
                    <div className="loginContainerBottomPartContainerHrDivElement" />
                    <NavLink to="/"  className="loginContainerBottomPartContainerText">Terms of Service</NavLink>
                </div>
            </div>

        </div>
        
    </div>
  )
}

export default Login