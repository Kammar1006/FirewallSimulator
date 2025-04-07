import React from 'react';
import "./App.css";

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Tasks from './pages/Tasks/Tasks';
import Navbar from './components/Navbar/Navbar';
import TaskDetails from './pages/TaskDetails/TaskDetails';

import AlertsAndNotifications from './pages/Alerts and Notifications/AlertsAndNotifications';
import InboundRules from './pages/Inbound Rules/InboundRules';
import NetworkSettings from './pages/Network Settings/NetworkSettings';
import OutboundRules from './pages/Outbound Rules/OutboundRules';
import SecurityPolicies from './pages/Security Policies/SecurityPolicies';
import TrafficMonitoring from './pages/Traffic Monitoring/TrafficMonitoring';
import Login from './pages/Login/Login';
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <div className="App">

        <div className="appContainer">
            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/alertsAndNotifications" element={<AlertsAndNotifications />} />
              <Route path="/inboundRules" element={<InboundRules />} />
              <Route path="/networkSettings" element={<NetworkSettings />} />
              <Route path="/outboundRules" element={<OutboundRules />} />
              <Route path="/securityPolicies" element={<SecurityPolicies />} />
              <Route path="/trafficMonitoring" element={<TrafficMonitoring />} />
              <Route path="/login" element={<Login />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/task/:taskId" element={<TaskDetails />} />
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
        </div>

        
      </div>
    </ErrorBoundary>
  )
}

export default App