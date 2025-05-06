import React, { useEffect, useContext } from 'react';
import "./App.css";

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Tasks from './pages/Tasks/Tasks';
import Navbar from './components/Navbar/Navbar';
import TaskDetails from './pages/TaskDetails/TaskDetails';
import Login from './pages/Login/Login';
import Documentation from './pages/Documentation/Documentation';
import Adventure from './pages/Adventure/Adventure';
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { RulesContext } from './context/RulesContext';
// import Test from './pages/test/Test';

const App = () => {
  const { serverConfig } = useContext(RulesContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set serverConfig in window object
    window.serverConfig = serverConfig;
  }, [serverConfig]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const adminToken = localStorage.getItem("adminToken");
    
    if (!token && !adminToken && location.pathname !== "/login" && location.pathname !== "/documentation") {
      navigate("/login");
    } else if (token && !location.search.includes("token")) {
      navigate(`${location.pathname}?token=${token}`);
    }
  }, [location, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const studentId = localStorage.getItem("studentId");
      if (studentId) {
        //console.log(`Logged-in Student ID: ${studentId}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <div className="App">
        {/* Sprawdź konsolę przeglądarki, tam znajdziesz wskazówkę... */}
        <div className="appContainer">
          {location.pathname !== "/login" && location.pathname !== "/documentation" && location.pathname !== "/adventure" && <Navbar />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/task/:taskId" element={<TaskDetails />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/adventure" element={<Adventure />} />
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
    // Ukryta podpowiedź 2: Wpisz adventure() w konsoli...
    console.log("%cWpisz adventure() w konsoli, aby rozpocząć przygodę!", "color: transparent; font-size: 1px;");
    
    window.flag_solved = function() {
      const studentId = localStorage.getItem("studentId");
      if (!studentId) return;
      fetch(`/students/${studentId}/progress`, {
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

    window.adventure = function() {
      console.log("%cRozpoczynasz przygodę...", "color: #4CAF50; font-size: 18px; font-weight: bold;");
      window.location.href = '/adventure';
    };

    setTimeout(() => {
      if (window.console) {
        console.log("%cWpisz flag_solved() w konsoli, aby zaliczyć wszystkie zadania!", "color: green; font-size: 18px;");
      }
    }, 2000);
  }
})();