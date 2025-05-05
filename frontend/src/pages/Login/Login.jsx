import React, { useState, useEffect, useContext } from 'react';
import "./login.css";
import assets from '../../assets/assets';
import { FaShieldAlt } from "react-icons/fa";
import { FaRegIdCard, FaRegUser } from "react-icons/fa6";
import { MdLogin } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import { toast } from 'react-toastify';
import Loading from '../../components/Loading/Loading';
import { RulesContext } from '../../context/RulesContext';

const Login = () => {
  const { serverConfig } = useContext(RulesContext);
  const [id, setId] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [idFocused, setIdFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const navigate = useNavigate();

  const socket = io(serverConfig.address);

  const handleLogin = () => {
    setLoading(true); // Show loading spinner
    socket.emit("login", { id, lastName });

    socket.on("login_success", (data) => {
      setLoading(false); // Hide loading spinner
      const token = btoa(encodeURIComponent(`${data.id}:${data.name}`)); // Encode token
      localStorage.setItem("authToken", token); // Store token in localStorage
      localStorage.setItem("studentId", id); // Store student ID in localStorage
      toast.success("Login successful!");
      socket.emit("get_student_progress", { studentId: id });
      navigate(`/?token=${token}`);
    });

    socket.on("login_failure", (message) => {
      setLoading(false); // Hide loading spinner
      setError(message);
      toast.error("Login failed. Please try again.");
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
    <>
      {loading && <Loading message="Authenticating..." />}
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
                        <FaRegIdCard
                          className="inputIcon"
                          style={{
                            color: idFocused ? "#000" : "#888",
                            transition: "all 0.2s ease-in-out",
                          }}
                        />
                        <input
                          type="text"
                          className="loginContainerElementContainerSecondConainerFirstDivInput"
                          placeholder='Enter your student ID'
                          value={id}
                          onChange={(e) => setId(e.target.value)}
                          onFocus={() => setIdFocused(true)}
                          onBlur={() => setIdFocused(false)}
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
                        <FaRegUser
                          className="inputIcon"
                          style={{
                            color: lastNameFocused ? "#000" : "#888",
                            transition: "all 0.3s ease-in-out",
                          }}
                        />
                        <input
                          type="text"
                          className="loginContainerElementContainerSecondConainerSecondTextInput"
                          placeholder='Enter your last name'
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          onFocus={() => setLastNameFocused(true)}
                          onBlur={() => setLastNameFocused(false)}
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
                  <p className="loginContainerElementContainerFourthContainerText inter">
                    Network & Firewall Management Simulator
                  </p>
                  <p className="loginContainerElementContainerFourthContainerTextTwo inter">
                    Academic Year 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;