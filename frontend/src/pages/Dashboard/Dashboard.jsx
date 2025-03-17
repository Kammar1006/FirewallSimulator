import React from 'react';
import "./dashboard.css";
import Card from '../../components/Card/Card';
import ActivityCard from '../../components/ActivityCard/ActivityCard';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboardContainer">

        <div className="column">
          <Card 
            title={"Inbound Rules"}
            description={"Configure rules for incoming traffic."} 
            btnText={"Add Rule"} 
            location={"/inboundRules"}
            optionType={"optionOne"}
            
          />

          <Card 
            title={"Security Policies"}
            description={"Set security policies for the network."} 
            btnText={"Manage Policies"} 
            location={"/securityPolicies"}
            optionType={"optionTwo"}
          />
        </div>

        <div className="column">
          <Card 
            title={"Outbound Rules"}
            description={"Manage rules for outgoing traffic."} 
            btnText={"Add Rule"} 
            location={"/outboundRules"}
            optionType={"optionThree"}
          />

          <Card 
            title={"Traffic Monitoring"}
            description={"Analyze network traffic data."} 
            btnText={"View Logs"} 
            location={"/trafficMonitoring"}
            optionType={"optionFour"}
          />
        </div>

        <div className="column">
          <Card 
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
          />
        </div>

        <ActivityCard title={"Recent Activity"} />


      </div>
    </div>
  );
}

export default Dashboard