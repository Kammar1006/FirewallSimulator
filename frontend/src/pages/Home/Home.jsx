import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { FaGamepad } from "react-icons/fa6";
import { HiComputerDesktop } from "react-icons/hi2";
import { FaCode } from "react-icons/fa6";
import { PiTestTubeFill } from "react-icons/pi";
import { FaBook } from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";

const Home = () => {
  const navigate = useNavigate();

  const handleDocumentationClick = () => {
    window.open("/documentation", "_blank"); // Open in a new tab
  };

  return (
    <div className="home">
      <div className="homeContainer">

        {/* First Part */}
        <div className="homeContainerFirst">
          <div className="homeContainerFirstContainer">

            <div className="homeContainerFirstContainerFirst">
              <div className="homeContainerFirstContainerFirstContainer">
                <div className="homeContainerFirstContainerFirstContainerLeft">
                  <FaGamepad className="homeContainerFirstContainerFirstContainerLeftIcon" /> 
                </div>

                <div className="homeContainerFirstContainerFirstContainerRight">
                  <p className="homeContainerFirstContainerFirstContainerRightText">
                    Grupa 5: Wizualizacja i Konfiguracja ACL i Firewall
                  </p>
                </div>
              </div>
            </div>

            <div className="homeContainerFirstContainerSecond">
              <div className="homeContainerFirstContainerSecondContainer">
                <p className="homeContainerFirstContainerSecondContainerText">
                  Interaktywna aplikacja do nauki i testowania reguł firewalla poprzez wizualizację i symulację.
                </p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Second Part */}
        <div className="homeContainerSecond">
          <div className="homeContainerSecondContainer">

            {/* Element */}
            <div className="homeContainerSecondContainerElement">
              <div className="homeContainerSecondContainerElementContainer">

                {/* Top Part */}
                <div className="homeContainerSecondContainerElementContainerTop">
                  <div className="homeContainerSecondContainerElementContainerTopContainer">
                    <HiComputerDesktop className="homeContainerSecondContainerElementContainerTopContainerIcon" />
                    <p className="homeContainerSecondContainerElementContainerTopContainerText">
                      Wizualizacja Interaktywna
                    </p>
                  </div>
                </div>

                {/* Bottom Part */}
                <div className="homeContainerSecondContainerElementContainerBottom">
                  <p className="homeContainerSecondContainerElementContainerBottomText">
                    Aplikacja webowa z unikalną wizualizacją w formie gry komputerowej dla lepszego zrozumienia działania firewalla.
                  </p>
                </div>
              </div>
            </div>

            {/* Element */}
            <div className="homeContainerSecondContainerElement">
              <div className="homeContainerSecondContainerElementContainer">
                {/* Top Part */}
                <div className="homeContainerSecondContainerElementContainerTop">
                  <div className="homeContainerSecondContainerElementContainerTopContainer">
                    <FaCode  className="homeContainerSecondContainerElementContainerTopContainerIcon" />
                    <p className="homeContainerSecondContainerElementContainerTopContainerText">
                        Edytor Reguł
                    </p>
                  </div>
                </div>

                {/* Bottom Part */}
                <div className="homeContainerSecondContainerElementContainerBottom">
                  <p className="homeContainerSecondContainerElementContainerBottomText">
                    Zaawansowany edytor reguł iptables i ACL z opcją wyboru interfejsu graficznego lub tekstowego.
                  </p>
                </div>
              </div>
            </div>

            {/* Element */}
            <div className="homeContainerSecondContainerElement">
              <div className="homeContainerSecondContainerElementContainer">
                {/* Top Part */}
                <div className="homeContainerSecondContainerElementContainerTop">
                  <div className="homeContainerSecondContainerElementContainerTopContainer">
                    <PiTestTubeFill  className="homeContainerSecondContainerElementContainerTopContainerIcon" />
                    <p className="homeContainerSecondContainerElementContainerTopContainerText">
                      Środowisko Testowe
                    </p>
                  </div>
                </div>

                {/* Bottom Part */}
                <div className="homeContainerSecondContainerElementContainerBottom">
                  <p className="homeContainerSecondContainerElementContainerBottomText">
                    Symulator do testowania reguł i wizualizacji efektów na wzorcach pakietów.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Third Part */}
        <div className="homeContainerThird">
          <div className="homeContainerThirdContainer">
            {/* Top Part */}
            <div className="homeContainerThirdContainerTop">
              <div className="homeContainerThirdContainerTopContainer">
                <p className="homeContainerThirdContainerTopContainerText">
                  Rozpocznij Pracę
                </p>
              </div>
            </div>

            {/* Bottom Part */}
            <div className="homeContainerThirdContainerBottom">
              <div className="homeContainerThirdContainerBottomContainer">
                
                {/* Left Part */}
                <div
                  className="homeContainerThirdContainerBottomContainerLeft"
                  onClick={handleDocumentationClick}
                  style={{ cursor: "pointer" }}
                >
                  <div className="homeContainerThirdContainerBottomContainerLeftContainer">
                    <div className="homeContainerThirdContainerBottomContainerLeftContainerLeft">
                      <FaBook className="homeContainerThirdContainerBottomContainerLeftContainerLeftIcon" />
                    </div>
                    <div className="homeContainerThirdContainerBottomContainerLeftContainerRight">
                      <div className="homeContainerThirdContainerBottomContainerLeftContainerRightContainer">
                        <p className="homeContainerThirdContainerBottomContainerLeftContainerRightContainerTextOne">
                          Dokumentacja
                        </p>
                        <p className="homeContainerThirdContainerBottomContainerLeftContainerRightContainerTextTwo">
                          Szczegółowy przewodnik użytkownika
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Part */}
                <div className="homeContainerThirdContainerBottomContainerLeft">
                  <div className="homeContainerThirdContainerBottomContainerLeftContainer">
                    <div className="homeContainerThirdContainerBottomContainerLeftContainerLeft">
                      <GiGraduateCap className="homeContainerThirdContainerBottomContainerLeftContainerLeftIcon" />
                    </div>
                    <div className="homeContainerThirdContainerBottomContainerLeftContainerRight">
                      <div className="homeContainerThirdContainerBottomContainerLeftContainerRightContainer">
                        <p className="homeContainerThirdContainerBottomContainerLeftContainerRightContainerTextOne">
                          Samouczek
                        </p>
                        <p className="homeContainerThirdContainerBottomContainerLeftContainerRightContainerTextTwo">
                          Interkatywny kurs konfiguracji
                        </p>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
