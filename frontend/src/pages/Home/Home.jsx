import React from 'react';
import "./home.css";

const Home = () => {
  return (
    <div className="home">

      <div className="homeContainer">




        <div className="homeContainerSet">

          <div className="homeContainerSetOne">
            <div className="homeContainerSetOneSquare One">
              <p className="homeContainerSetOneSquareText">
                PC-A
              </p>
            </div>
            <div className="homeContainerSetOneSquare Two">
            <p className="homeContainerSetOneSquareText">
                PC-B
              </p>
            </div>
            <div className="homeContainerSetOneSquare Three">
            <p className="homeContainerSetOneSquareText">
                PC-C
              </p>
            </div>
            <div className="homeContainerSetOneSquare Four">
            <p className="homeContainerSetOneSquareText">
                PC-D
              </p>
            </div>
          </div>




          <div className="homeContainerSetTwo">
            <div className='homeContainerSetTwoLineOne' />
            <div className='homeContainerSetTwoLineTwo' />
            <div className='homeContainerSetTwoLineThree' />
            <div className='homeContainerSetTwoLineFour' />
          </div>




          <div className="homeContainerSetThree">
            <div className="homeContainerSetThreeSwitch One">
              <p className="homeContainerSetThreeSwitchText">S1</p>
            </div>
            <div className="homeContainerSetThreeSwitch Two">
            <p className="homeContainerSetThreeSwitchText">S2</p>
            </div>
          </div>





          <div className="homeContainerSetFour">
            <div className='homeContainerSetFourLineOne' />
            <div className='homeContainerSetFourLineTwo' />
            {/* <div className='homeContainerSetFourLineThree' />
            <div className='homeContainerSetFourLineFour' /> */}
          </div>



          <div className="homeContainerSetFive">
            <div className="homeContainerSetFiveRounter One">R1</div>
            <div className="homeContainerSetFiveRounter One">R2</div>
          </div>





          <div className="homeContainerSetSix">
            <div className='homeContainerSetSixLineOne' />
            <div className='homeContainerSetSixLineTwo' />
          </div>

          <div className="homeContainerSetSeven">
            <div className="homeContainerSetSevenRouter">R3</div>
          </div>

          <div className="homeContainerSetEight">
            <div className="homeContainerSetEightLineOne" />
          </div>

          <div className="homeContainerSetNine">
            <div className="homeContainerSetNineSwitch">S3</div>
          </div>

          <div className="homeContainerSetTen">
            <div className='homeContainerSetTenLineOne' />
            <div className='homeContainerSetTenLineTwo' />
          </div>

          <div className="homeContainerSetEleven">
            <div className="homeContainerSetElevenSquare One">PC-E</div>
            <div className="homeContainerSetElevenSquare Two">PC-F</div>

          </div>

        </div>




      </div>
      
    </div>
  )
}

export default Home