import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./dashboard.css";
import Card from "../../components/Card/Card";
import ActivityCard from "../../components/ActivityCard/ActivityCard";

const Dashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const deviceName = queryParams.get("device");

  const navigate = useNavigate();

  const handleInboundClick = (deviceName) => {
    navigate(`/inboundRules?device=${deviceName}`);
  };

  const handleOutboundClick = (deviceName) => {
    navigate(`/inboundRules?device=${deviceName}`);
  };

  return (
    <div className="dashboard">
      <div className="dashboardContainer">
        {/* <h1>Dashboard for {device || "Unknown Device"}</h1> */}
        <div className="column">
          <Card
            title={"Inbound Rules"}
            description={"Configure rules for incoming traffic."}
            btnText={"Add Rule"}
            location={`/inboundRules?device=${deviceName}`}
            optionType={"optionOne"}
            // device={deviceName}
          />
          {/* <Card
            title={"Security Policies"}
            description={"Set security policies for the network."}
            btnText={"Manage Policies"}
            location={"/securityPolicies"}
            optionType={"optionTwo"}
            
          /> */}
        </div>
        <div className="column">
          <Card
            title={"Outbound Rules"}
            description={"Manage rules for outgoing traffic."}
            btnText={"Add Rule"}
            location={"/outboundRules"}
            optionType={"optionThree"}
            // device={deviceName}
          />
          {/* <Card
            title={"Traffic Monitoring"}
            description={"Analyze network traffic data."}
            btnText={"View Logs"}
            location={"/trafficMonitoring"}
            optionType={"optionFour"}
          /> */}
        </div>
        <div className="column">
          {/* <Card
            title={"Network Settings"}
            description={"Adjust network configurations."}
            btnText={"Edit Settings"}
            location={"/networkSettings"}
            optionType={"optionFive"}
          />
          <Card
            title={"Alerts and Notifications"}
            description={"Set up alerts for potential threats."}
            btnText={"Configure Alerts"}
            location={"/alertsAndNotifications"}
            optionType={"optionSix"}
          /> */}
        </div>
        <ActivityCard title={"Tasks"} />
      </div>
    </div>
  );
};

export default Dashboard;
