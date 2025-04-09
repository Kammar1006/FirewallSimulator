import React, { useState, useEffect } from 'react';
import "./login.css";
import assets from '../../assets/assets';
import { FaShieldAlt } from "react-icons/fa";
import { FaRegIdCard, FaRegUser } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

const socket = io("http://localhost:5003");

const Login = () => {
  const [id, setId] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    socket.emit("login", { id, lastName });

    socket.on("login_success", (data) => {
      console.log("Login successful:", data);
      navigate("/tasks");
    });

    socket.on("login_failure", (message) => {
      setError(message);
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleLogin();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [id, lastName]);

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="loginContainerElement">
          <div className="loginContainerElementContainer">
            {/* First Part */}
            <div className="loginContainerElementContainerFirst">
              <div className="loginContainerElementContainerFirstContainer">
                <FaShieldAlt className="loginContainerElementContainerFirstContainerIcon" />
                <p className="loginContainerElementContainerFirstContainerTextOne">
                  Network Firewall Simulator
                </p>
                <p className="loginContainerElementContainerFirstContainerTextTwo">
                  Student Authentication
                </p>
              </div>
            </div>

            {/* Second Part */}
            <div className="loginContainerElementContainerSecond">
              <div className="loginContainerElementContainerSecondConainer">
                <div className="loginContainerElementContainerSecondConainerFirst">
                  <p className="loginContainerElementContainerSecondConainerFirstText">
                    Student ID Number
                  </p>
                  <div className="loginContainerElementContainerSecondConainerFirstDiv">
                    <div className="inputWithIcon">
                      <FaRegIdCard className='inputIcon' />
                      <input
                        type="text"
                        className="loginContainerElementContainerSecondConainerFirstDivInput"
                        placeholder='Enter your student ID'
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="loginContainerElementContainerSecondConainerSecond">
                  <p className="loginContainerElementContainerSecondConainerSecondText">
                    Last Name
                  </p>
                  <div className="loginContainerElementContainerSecondConainerSecondDiv">
                    <div className="inputWithIcon">
                      <FaRegUser className="inputIcon" />
                      <input
                        type="text"
                        className="loginContainerElementContainerSecondConainerSecondTextInput"
                        placeholder='Enter your last name'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Part */}
            <div className="loginContainerElementContainerThird">
              <button
                className="loginContainerElementContainerThirdContainerBtn"
                onClick={handleLogin}
              >
                <MdLogin className="loginContainerElementContainerThirdContainerBtnInput" />
                <p className="loginContainerElementContainerThirdContainerBtnText">
                  Login to Simulator
                </p>
              </button>
              {error && <p className="loginError">{error}</p>}
            </div>

            {/* Fourth Part */}
            <div className="loginContainerElementContainerFourth">
              <div className="loginContainerElementContainerFourthContainer">
                <p className="loginContainerElementContainerFourthContainerText">
                  Network & Firewall Management Simulator
                </p>
                <p className="loginContainerElementContainerFourthContainerTextTwo">
                  Academic Year 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;