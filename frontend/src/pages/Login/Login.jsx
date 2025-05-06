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
import bcrypt from 'bcryptjs';

const Login = () => {
  const { serverConfig } = useContext(RulesContext);
  const [id, setId] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [idFocused, setIdFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    id: '',
    lastName: '',
    firstName: '',
    progress: [0, 0, 0, 0, 0, 0]
  });
  const navigate = useNavigate();

  const socket = io();

  const hashedPassword = '$2a$12$GHr2VKqqFwUlTRbYXLrvkuGxK2xwwCVsWwvkKD6Q3wCYqK96vTRQK';

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken === 'admin') {
      setIsAuthenticated(true);
      setShowAdminPanel(true);
    }
    if (showAdminPanel) {
      fetchStudents();
    }
  }, [showAdminPanel]);

  useEffect(() => {
    const handleProgressUpdate = () => {
      fetchStudents();
    };
    socket.on("student_progress_updated", handleProgressUpdate);
    return () => {
      socket.off("student_progress_updated", handleProgressUpdate);
    };
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/students`);
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data);
      setError('');
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setLoading(true);
    socket.emit("login", { id, lastName });

    socket.on("login_success", (data) => {
      setLoading(false);
      const token = btoa(encodeURIComponent(`${data.id}:${data.name}`));
      localStorage.setItem("authToken", token);
      localStorage.setItem("studentId", id);
      toast.success("Login successful!");
      socket.emit("get_student_progress", { studentId: id });
      navigate(`/?token=${token}`);
    });

    socket.on("login_failure", (message) => {
      setLoading(false);
      setError(message);
      toast.error("Login failed. Please try again.");
    });
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === 'admin' && await bcrypt.compare(password, hashedPassword)) {
      setIsAuthenticated(true);
      localStorage.setItem('adminToken', 'admin');
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setShowAdminPanel(false);
    setError('');
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/students`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add student');
      }

      setNewStudent({
        id: '',
        lastName: '',
        firstName: '',
        progress: [0, 0, 0, 0, 0, 0]
      });
      fetchStudents();
      setError('');
    } catch (error) {
      console.error('Error adding student:', error);
      setError(error.message);
    }
  };

  const handleUpdateProgress = async (studentId, taskIndex, value) => {
    try {
      const response = await fetch(`/students/${studentId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskIndex, value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      fetchStudents();
      setError('');
    } catch (error) {
      console.error('Error updating progress:', error);
      setError('Failed to update progress. Please try again.');
    }
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

  // Add the showHiddenAdminPanel function to window
  useEffect(() => {
    window.showHiddenAdminPanel = () => {
      setShowAdminPanel(true);
      console.log("%cPanel administratora został odblokowany!", "color: #00c853; font-size: 18px;");
    };
  }, []);

  return (
    <>
      {loading && <Loading message="Authenticating..." />}
      <div className="login">
        <div className="loginContainer">
          <div className="loginContainerElement">
            <div className="loginContainerElementContainer">
              {!showAdminPanel ? (
                <div className="loginContainerElementContainerElement">
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
              ) : !isAuthenticated ? (
                <div className="admin-login-container">
                  <div className="admin-login">
                    <h2>Admin Login</h2>
                    <form onSubmit={handleAdminLogin}>
                      <input type="text" name="username" placeholder="Username" required />
                      <input type="password" name="password" placeholder="Password" required />
                      {error && <p className="error">{error}</p>}
                      <button type="submit">Login</button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="admin-panel">
                  <div className="admin-header">
                    <h2>Admin Panel</h2>
                    <button className="logout-button" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                  
                  {error && <p className="error">{error}</p>}
                  
                  <div className="add-student">
                    <h3>Add New Student</h3>
                    <form onSubmit={handleAddStudent}>
                      <input
                        type="text"
                        placeholder="Student ID"
                        value={newStudent.id}
                        onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={newStudent.lastName}
                        onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="First Name"
                        value={newStudent.firstName}
                        onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                        required
                      />
                      <button type="submit">Add Student</button>
                    </form>
                  </div>

                  <div className="students-list">
                    <h3>Students</h3>
                    {loading ? (
                      <p className="loading">Loading students...</p>
                    ) : students.length === 0 ? (
                      <p className="no-students">No students found</p>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Task 1</th>
                            <th>Task 2</th>
                            <th>Task 3</th>
                            <th>Task 4</th>
                            <th>Task 5</th>
                            <th>Task 6</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.id}>
                              <td>{student.id}</td>
                              <td>{`${student.firstName} ${student.lastName}`}</td>
                              {student.progress.map((progress, index) => (
                                <td key={index}>
                                  <button
                                    onClick={() => handleUpdateProgress(student.id, index, progress === 0 ? 1 : 0)}
                                    className={progress === 1 ? 'completed' : 'not-completed'}
                                  >
                                    {progress === 1 ? '✓' : '✗'}
                                  </button>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;