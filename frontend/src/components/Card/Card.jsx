import React, { useState } from "react";
import "./card.css";
import assets from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Card = ({ title, description, btnText, location, optionType }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`card ${optionType}`}>
      <div className="cardContainer">
        <div className="cardContainerTitle">
          <p className="cardContainerTitleText">{title}</p>
          <div className="cardContainerTitleIconContainer">
            <img
              src={assets.infoIcon}
              alt=""
              className="cardContainerTitleInfoIcon"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />

            {isHovered && (
              <div className={`cardInfoContainer ${optionType}`}>
                <div className="cardInfoContainerBox">
                  <div className="cardInfoContainerTriangle" />
                  {/* Top Part*/}
                  <div className="cardInfoContainerTop">
                    <p className="cardInfoContainerTopText">{title}</p>
                  </div>

                  {/* Bottom Part */}
                  <div className="cardInfoContainerBottom">
                    <p className="cardInfoContainerBottomText">{description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="cardContainerDescription">
          <p className="cardContainerDescriptionText">{description}</p>
        </div>

        <NavLink
          to={`${location}`}
          className={`cardContainerButtonBtn ${optionType}`}
        >
          {btnText}
        </NavLink>
      </div>
    </div>
  );
};

export default Card;
