import React from 'react';
import "./outboundRules.css";
import ACLElement from '../../components/ACLElement/ACLElement';

const OutboundRules = () => {
  return (
    <div className="outboundRules">

      <div className="outboundRulesContainer">

        {/* Top Part */}
        <div className="outboundRulesContainerTop">

          <div className="outboundRulesContainerTopLeft">
            <div className="outboundRulesContainerTopLeftTitle">
              <p className="outboundRulesContainerTopLeftTitleText">
                Access Control Rules

              </p>
            </div>
          </div>


          <div className="outboundRulesContainerTopRight">
            <div className="outboundRulesContainerTopRightSearchBar">
              <input 
                  type="text" 
                  placeholder="Search Rules..." 
                  className="outboundRulesContainerTopRightSearchBarInput" 
                />
            </div>

            <div className="outboundRulesContainerTopRightAddRuleButton">
              <button className="outboundRulesContainerTopRightAddRuleButtonButton">
                Add New Rule
              </button>
            </div>

          </div>


        </div>





        {/* Headers */}
        <div className="outboundRulesContainerHeaders">
          <div className="outboundRulesContainerHeadersAction">Action</div>
          <div className="outboundRulesContainerHeadersProtocol">Protocol</div>
          <div className="outboundRulesContainerHeadersSource">Source</div>
          <div className="outboundRulesContainerHeadersDestination">Destination</div>
          <div className="outboundRulesContainerHeadersPort">Port</div>
        </div>


        {/* Middle Part */}
        <div className="outboundRulesContainerMiddleRules">
          <ACLElement
              id="1"
              action="Deny"
              protocol="TCP"
              source="192.168.1.1"
              destination="192.168.1.1"
              port="53"
            />
            <ACLElement
              id="2"
              action="Deny"
              protocol="TCP"
              source="192.168.1.2"
              destination="192.168.1.2"
              port="80"
            />
            <ACLElement
              id="3"
              action="Deny"
              protocol="UDP"
              source="192.168.1.3"
              destination="192.168.1.3"
              port="443"
            />
            <ACLElement
              id="4"
              action="Deny"
              protocol="TCP"
              source="192.168.1.4"
              destination="192.168.1.4"
              port="22"
            />
        </div>

      </div>
      
    </div>
  )
}

export default OutboundRules