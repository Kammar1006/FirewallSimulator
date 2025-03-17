import React from 'react';
import "./App.css";

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';


import Navbar from './components/Navbar/Navbar';


import AlertsAndNotifications from './pages/Alerts and Notifications/AlertsAndNotifications';
import InboundRules from './pages/Inbound Rules/InboundRules';
import NetworkSettings from './pages/Network Settings/NetworkSettings';
import OutboundRules from './pages/Outbound Rules/OutboundRules';
import SecurityPolicies from './pages/Security Policies/SecurityPolicies';
import TrafficMonitoring from './pages/Traffic Monitoring/TrafficMonitoring';
import Login from './pages/Login/Login';

const App = () => {
  return (
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
            {/* <Route component={NotFound} /> */}
          </Routes>
      </div>

      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>

      
    </div>
  )
}

export default App