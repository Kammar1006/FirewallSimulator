import React, { useContext } from 'react';
import "./outboundRules.css";
import ACLElement from '../../components/ACLElement/ACLElement';
import { RulesContext } from '../../context/RulesContext';

const OutboundRules = () => {

  const { rules, addRule, removeRule, editRule } = useContext(RulesContext);

  return (
    <div className="outboundRules">

      <div className="outboundRulesContainer">

        {/* Top Part */}
        <div className="outboundRulesContainerTop">

          <div className="outboundRulesContainerTopLeft">
            <div className="outboundRulesContainerTopLeftTitle">
              <p className="outboundRulesContainerTopLeftTitleText">
                {/* Access Control Rules */}
                ACL Outbound Rules
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
          {rules.map((rule) => (
              <ACLElement
                key={rule.id}
                id={rule.id}
                action={rule.action}
                protocol={rule.protocol}
                source={rule.source}
                destination={rule.destination}
                port={rule.port}
                onEdit={editRule}
                onDelete={() => removeRule(rule.id)}
              />
            ))}
        </div>




















      </div>
      
    </div>
  )
}

export default OutboundRules