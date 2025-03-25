import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleDeviceClick = (deviceName) => {
    navigate(`/dashboard?device=${deviceName}`);
  };

  return (
    <div className="home">
      <div className="homeContainer">
        <div className="homeContainerSet">
          <div className="homeContainerSetOne">
            <div className="homeContainerSetOneSquare One" onClick={() => handleDeviceClick("PC-A")}>
              <p className="homeContainerSetOneSquareText">PC-A</p>
            </div>
            <div className="homeContainerSetOneSquare Two" onClick={() => handleDeviceClick("PC-B")}>
              <p className="homeContainerSetOneSquareText">PC-B</p>
            </div>
            <div className="homeContainerSetOneSquare Three" onClick={() => handleDeviceClick("PC-C")}>
              <p className="homeContainerSetOneSquareText">PC-C</p>
            </div>
            <div className="homeContainerSetOneSquare Four" onClick={() => handleDeviceClick("PC-D")}>
              <p className="homeContainerSetOneSquareText">PC-D</p>
            </div>
          </div>

          <div className="homeContainerSetTwo">
            <div className="homeContainerSetTwoLineOne" />
            <div className="homeContainerSetTwoLineTwo" />
            <div className="homeContainerSetTwoLineThree" />
            <div className="homeContainerSetTwoLineFour" />
          </div>

          <div className="homeContainerSetThree">
            <div className="homeContainerSetThreeSwitch One" onClick={() => handleDeviceClick("S1")}>
              <p className="homeContainerSetThreeSwitchText">S1</p>
            </div>
            <div className="homeContainerSetThreeSwitch Two" onClick={() => handleDeviceClick("S2")}>
              <p className="homeContainerSetThreeSwitchText">S2</p>
            </div>
          </div>

          <div className="homeContainerSetFour">
            <div className="homeContainerSetFourLineOne" />
            <div className="homeContainerSetFourLineTwo" />
          </div>

          <div className="homeContainerSetFive">
            <div className="homeContainerSetFiveRounter One" onClick={() => handleDeviceClick("R1")}>
              <p>R1</p>
            </div>
            <div className="homeContainerSetFiveRounter Two" onClick={() => handleDeviceClick("R2")}>
              <p>R2</p>
            </div>
          </div>

          <div className="homeContainerSetSix">
            <div className="homeContainerSetSixLineOne" />
            <div className="homeContainerSetSixLineTwo" />
          </div>

          <div className="homeContainerSetSeven">
            <div className="homeContainerSetSevenRouter" onClick={() => handleDeviceClick("R3")}>
              <p>R3</p>
            </div>
          </div>

          <div className="homeContainerSetEight">
            <div className="homeContainerSetEightLineOne" />
          </div>

          <div className="homeContainerSetNine">
            <div className="homeContainerSetNineSwitch" onClick={() => handleDeviceClick("S3")}>
              <p>S3</p>
            </div>
          </div>

          <div className="homeContainerSetTen">
            <div className="homeContainerSetTenLineOne" />
            <div className="homeContainerSetTenLineTwo" />
          </div>

          <div className="homeContainerSetEleven">
            <div className="homeContainerSetElevenSquare One" onClick={() => handleDeviceClick("PC-E")}>
              <p>PC-E</p>
            </div>
            <div className="homeContainerSetElevenSquare Two" onClick={() => handleDeviceClick("PC-F")}>
              <p>PC-F</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;