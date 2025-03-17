import React from 'react';
import "./activityCard.css";
import ActivityElement from '../ActivityElement/ActivityElement';

const ActivityCard = ({ title }) => {
  return (
    <div className="activityCard">

        <div className="activityCardContainer">

            <div className="activityCardContainerTitle">
              <p className="activityCardContainerTitleText">
                {title}
              </p>
            </div>

            <div className="activityCardContainerActivityContainer">
              <ActivityElement 
                text={"Rule 'Allow HTTP' was added successfully."} ruleType={"fail"}
              />
              <ActivityElement 
                text={"Rule 'Allow HTTP' was added successfully."} ruleType={"warning"}
              />
              <ActivityElement 
                text={"Rule 'Allow HTTP' was added successfully."} ruleType={"success"}
              />
              <ActivityElement 
                text={"Rule 'Allow HTTP' was added successfully. dsafk l;jsdkl;a fjlk;sa djf"} ruleType={"success"}
              />
              <ActivityElement 
                text={"Rule 'Allow HTTP' was added successfully."} ruleType={"success"}
              />
              <ActivityElement 
                text={"Rule 'Allow HTTP' was added successfully."} ruleType={"success"}
              />
              <ActivityElement 
                text={"Rule 'Allow HTTP' was added successfully."} ruleType={"success"}
              />
            </div>

        </div>
        
    </div>
  )
}

export default ActivityCard