import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RulesContext } from "../../context/RulesContext";
import "./home.css";
import { FaGamepad } from "react-icons/fa6";
import { HiComputerDesktop } from "react-icons/hi2";
import { FaCode } from "react-icons/fa6";
import { PiTestTubeFill } from "react-icons/pi";
import { FaBook } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { FaUserShield } from "react-icons/fa";
import { io } from "socket.io-client";
import bcrypt from 'bcryptjs';

const Home = () => {
  const navigate = useNavigate();
  const { serverConfig } = useContext(RulesContext);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newStudent, setNewStudent] = useState({
    id: '',
    lastName: '',
    firstName: '',
    progress: [0, 0, 0, 0, 0, 0]
  });

  const socket = io(serverConfig.address);
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
      const response = await fetch(`${serverConfig.address}/students`);
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
      const response = await fetch(`${serverConfig.address}/students`, {
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
      const response = await fetch(`${serverConfig.address}/students/${studentId}/progress`, {
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

  // Add the showHiddenAdminPanel function to window
  useEffect(() => {
    window.showHiddenAdminPanel = () => {
      setShowAdminPanel(true);
      console.log("%cPanel administratora został odblokowany!", "color: #00c853; font-size: 18px;");
    };
  }, []);

  const handleDocumentationClick = () => {
    window.open("/documentation", "_blank");
  };

  if (showAdminPanel) {
    return (
      <div className="adminPanelFullPage">
        <div className="adminPanel">
          <div className="adminPanelHeader">
            <FaUserShield className="adminPanelIcon" />
            <h2>Panel Administratora</h2>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          
          {!isAuthenticated ? (
            <div className="admin-login">
              <h2>Admin Login</h2>
              <form onSubmit={handleAdminLogin}>
                <input type="text" name="username" placeholder="Username" required />
                <input type="password" name="password" placeholder="Password" required />
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
              </form>
            </div>
          ) : (
            <div className="adminPanelContent">
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
    );
  }

  return (
    <div className="home">
      <div className="homeContainer">
        {/* First Part */}
        <div className="homeContainerFirst">
          <div className="homeContainerFirstContainer">
            <div className="homeContainerFirstContainerFirst">
              <div className="homeContainerFirstContainerFirstContainer">
                <div className="homeContainerFirstContainerFirstContainerLeft">
                  <FaGamepad className="homeContainerFirstContainerFirstContainerLeftIcon" /> 
                </div>
                <div className="homeContainerFirstContainerFirstContainerRight">
                  <p className="homeContainerFirstContainerFirstContainerRightText">
                    Grupa 5: Wizualizacja i Konfiguracja ACL i Firewall
                  </p>
                </div>
              </div>
            </div>
            <div className="homeContainerFirstContainerSecond">
              <div className="homeContainerFirstContainerSecondContainer">
                <p className="homeContainerFirstContainerSecondContainerText">
                  Interaktywna aplikacja do nauki i testowania reguł firewalla poprzez wizualizację i symulację.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Part */}
        <div className="homeContainerSecond">
          <div className="homeContainerSecondContainer">
            {/* Element */}
            <div className="homeContainerSecondContainerElement">
              <div className="homeContainerSecondContainerElementContainer">
                {/* Top Part */}
                <div className="homeContainerSecondContainerElementContainerTop">
                  <div className="homeContainerSecondContainerElementContainerTopContainer">
                    <HiComputerDesktop className="homeContainerSecondContainerElementContainerTopContainerIcon" />
                    <p className="homeContainerSecondContainerElementContainerTopContainerText">
                      Wizualizacja Interaktywna
                    </p>
                  </div>
                </div>
                {/* Bottom Part */}
                <div className="homeContainerSecondContainerElementContainerBottom">
                  <p className="homeContainerSecondContainerElementContainerBottomText">
                    Aplikacja webowa z unikalną wizualizacją w formie gry komputerowej dla lepszego zrozumienia działania firewalla.
                  </p>
                </div>
              </div>
            </div>

            {/* Element */}
            <div className="homeContainerSecondContainerElement">
              <div className="homeContainerSecondContainerElementContainer">
                {/* Top Part */}
                <div className="homeContainerSecondContainerElementContainerTop">
                  <div className="homeContainerSecondContainerElementContainerTopContainer">
                    <FaCode className="homeContainerSecondContainerElementContainerTopContainerIcon" />
                    <p className="homeContainerSecondContainerElementContainerTopContainerText">
                      Edytor Reguł
                    </p>
                  </div>
                </div>
                {/* Bottom Part */}
                <div className="homeContainerSecondContainerElementContainerBottom">
                  <p className="homeContainerSecondContainerElementContainerBottomText">
                    Zaawansowany edytor reguł iptables i ACL z opcją wyboru interfejsu graficznego lub tekstowego.
                  </p>
                </div>
              </div>
            </div>

            {/* Element */}
            <div className="homeContainerSecondContainerElement">
              <div className="homeContainerSecondContainerElementContainer">
                {/* Top Part */}
                <div className="homeContainerSecondContainerElementContainerTop">
                  <div className="homeContainerSecondContainerElementContainerTopContainer">
                    <PiTestTubeFill className="homeContainerSecondContainerElementContainerTopContainerIcon" />
                    <p className="homeContainerSecondContainerElementContainerTopContainerText">
                      Środowisko Testowe
                    </p>
                  </div>
                </div>
                {/* Bottom Part */}
                <div className="homeContainerSecondContainerElementContainerBottom">
                  <p className="homeContainerSecondContainerElementContainerBottomText">
                    Symulator do testowania reguł i wizualizacji efektów na wzorcach pakietów.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Part */}
        <div className="homeContainerThird">
          <div className="homeContainerThirdContainer">
            {/* Top Part */}
            <div className="homeContainerThirdContainerTop">
              <div className="homeContainerThirdContainerTopContainer">
                <p className="homeContainerThirdContainerTopContainerText">
                  Rozpocznij Pracę
                </p>
              </div>
            </div>

            {/* Bottom Part */}
            <div className="homeContainerThirdContainerBottom">
              <div className="homeContainerThirdContainerBottomContainer">
                {/* Left Part */}
                <div
                  className="homeContainerThirdContainerBottomContainerLeft"
                  onClick={handleDocumentationClick}
                  style={{ cursor: "pointer" }}
                >
                  <div className="homeContainerThirdContainerBottomContainerLeftContainer">
                    <div className="homeContainerThirdContainerBottomContainerLeftContainerLeft">
                      <FaBook className="homeContainerThirdContainerBottomContainerLeftContainerLeftIcon" />
                    </div>
                    <div className="homeContainerThirdContainerBottomContainerLeftContainerRight">
                      <div className="homeContainerThirdContainerBottomContainerLeftContainerRightContainer">
                        <p className="homeContainerThirdContainerBottomContainerLeftContainerRightContainerTextOne">
                          Dokumentacja
                        </p>
                        <p className="homeContainerThirdContainerBottomContainerLeftContainerRightContainerTextTwo">
                          Szczegółowy przewodnik użytkownika
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Part */}
                <div className="homeContainerThirdContainerBottomContainerLeft">
                  <div className="homeContainerThirdContainerBottomContainerLeftContainer">
                    <div className="homeContainerThirdContainerBottomContainerLeftContainerLeft">
                      <GiGraduateCap className="homeContainerThirdContainerBottomContainerLeftContainerLeftIcon" />
                    </div>
                    <div className="homeContainerThirdContainerBottomContainerLeftContainerRight">
                      <div className="homeContainerThirdContainerBottomContainerLeftContainerRightContainer">
                        <p className="homeContainerThirdContainerBottomContainerLeftContainerRightContainerTextOne">
                          Samouczek
                        </p>
                        <p className="homeContainerThirdContainerBottomContainerLeftContainerRightContainerTextTwo">
                          Interkatywny kurs konfiguracji
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
