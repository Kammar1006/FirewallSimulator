import React from 'react';
import "./activityElement.css";

const ActivityElement = ({ text, ruleType }) => {
  return (
    <div className={`activityElement ${ruleType}`}>

        <div className="activityElementContainer">

            <div className="activityElementContainerTextContainer">
                <p className="activityElementContainerTextContainerText">
                    {text}
                </p>
            </div>
            
        </div>
        
    </div>
  )
}

export default ActivityElement