import React, { useEffect } from 'react';
import "./App.css";

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Tasks from './pages/Tasks/Tasks';
import Navbar from './components/Navbar/Navbar';
import TaskDetails from './pages/TaskDetails/TaskDetails';
import Login from './pages/Login/Login';
import Documentation from './pages/Documentation/Documentation';
import Admin from './pages/Admin/Admin';
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
// import Test from './pages/test/Test';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token && location.pathname !== "/login" && location.pathname !== "/admin") {
      navigate("/login");
    } else if (token && !location.search.includes("token")) {
      navigate(`${location.pathname}?token=${token}`);
    }
  }, [location, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const studentId = localStorage.getItem("studentId");
      if (studentId) {
        console.log(`Logged-in Student ID: ${studentId}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <div className="App">
        <div className="appContainer">
          {location.pathname !== "/login" && location.pathname !== "/documentation" && location.pathname !== "/admin" && <Navbar />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/task/:taskId" element={<TaskDetails />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/admin" element={<Admin />} />
            {/* <Route path="/test" element={<Test />} /> */}
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;

(function() {
  if (typeof window !== "undefined") {
    window.flag_solved = function() {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) return;
      fetch("http://localhost:5003/students/" + studentId + "/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskIndex: "all", value: 1 })
      })
      .then(res => res.json())
      .then(() => {
        alert("Wszystkie zadania zaliczone! Odśwież stronę, aby zobaczyć zmiany.");
        console.log("%cGratulacje! Znalazłeś easter egga i zaliczyłeś wszystkie zadania! 🏆", "color: gold; font-size: 20px; font-weight: bold;");
        console.log("%cFLAG: flag{solved}", "color: #00c853; font-size: 18px;");
        console.log(`%c
 ▄· ▄▌      ▄• ▄▌   ▄▄ •       ▄▄▄▄▄  ▪  ▄▄▄▄▄
▐█▪██▌▪     █▪██▌  ▐█ ▀ ▪▪     •██    ██ •██  
▐█▌▐█▪ ▄█▀▄ █▌▐█▌  ▄█ ▀█▄ ▄█▀▄  ▐█.▪  ▐█· ▐█.▪
 ▐█▀·.▐█▌.▐▌▐█▄█▌  ▐█▄▪▐█▐█▌.▐▌ ▐█▌·  ▐█▌ ▐█▌·
  ▀ •  ▀█▄▀▪ ▀▀▀   ·▀▀▀▀  ▀█▄▀▪ ▀▀▀   ▀▀▀ ▀▀▀  
`, "color: #00bfae; font-size: 20px; font-weight: bold;");
      });
    };
    setTimeout(() => {
      if (window.console) {
        console.log("%cWpisz flag_solved() w konsoli, aby zaliczyć wszystkie zadania!", "color: green; font-size: 18px;");
      }
    }, 2000);
  }
})();