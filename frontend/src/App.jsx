import React, { useEffect, useContext } from 'react';
import "./App.css";
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Tasks from './pages/Tasks/Tasks';
import Navbar from './components/Navbar/Navbar';
import TaskDetails from './pages/TaskDetails/TaskDetails';
import Login from './pages/Login/Login';
// import Documentation from './pages/Documentation/Documentation';
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
    
    if (!token && !adminToken && location.pathname !== "/login") {
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
          {location.pathname !== "/login" && location.pathname !== "/adventure" && <Navbar />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/task/:taskId" element={<TaskDetails />} />
            {/* <Route path="/documentation" element={<Documentation />} /> */}
            <Route path="/adventure" element={<Adventure />} />
            {/* <Route path="/test" element={<Test />} /> */}
          </Routes>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;