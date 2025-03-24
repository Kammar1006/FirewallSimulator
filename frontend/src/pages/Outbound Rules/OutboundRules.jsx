import React, { useContext, useState } from "react";
import "./outboundRules.css";
import ACLElement from "../../components/ACLElement/ACLElement";
import { RulesContext } from "../../context/RulesContext";
import assets from "../../assets/assets";

const OutboundRules = () => {
  const { rules, addRule, removeRule, editRule } = useContext(RulesContext);

  const [addNewRule, setAddNewRule] = useState(false);
  const [action, setAction] = useState("Deny");
  const [protocol, setProtocol] = useState("");
  const [protocolTwo, setProtocolTwo] = useState("");
  const [source, setSource] = useState("");
  const [sourceTwo, setSourceTwo] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationTwo, setDestinationTwo] = useState("");
  const [port, setPort] = useState("");
  const [portTwo, setPortTwo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRules = rules.filter((rule) =>
    `${rule.action} ${rule.protocol} ${rule.source} ${rule.destination} ${rule.port}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setAction("Deny");
    setProtocol("");
    setProtocolTwo("");
    setSource("");
    setSourceTwo("");
    setDestination("");
    setDestinationTwo("");
    setPort("");
    setPortTwo("");
  };

  const handleAddRule = () => {
    setAddNewRule(false);
    addRule({
      id: rules.length + 1,
      action,
      protocol: protocol === "Other" ? protocolTwo : protocol,
      source: source === "Custom" ? sourceTwo : source,
      destination: destination === "Custom" ? destinationTwo : destination,
      port: port === "Custom" ? portTwo : port,
    });
    resetForm();
    setSearchTerm(""); // Reset search term after adding a rule
  };

  const handleClose = () => {
    setAddNewRule(false);
    resetForm();
  };

  return (
    <div className="outboundRules">
      <div className="outboundRulesContainer">
        {/* Top Part */}
        <div className="outboundRulesContainerTop">
          <div className="outboundRulesContainerTopLeft">
            <div className="outboundRulesContainerTopLeftTitle">
              <p className="outboundRulesContainerTopLeftTitleText">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="outboundRulesContainerTopRightAddRuleButton">
              <button
                className="outboundRulesContainerTopRightAddRuleButtonButton"
                onClick={() => setAddNewRule(true)}
              >
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
          <div className="outboundRulesContainerHeadersDestination">
            Destination
          </div>
          <div className="outboundRulesContainerHeadersPort">Port</div>
        </div>

        {/* Middle Part */}
        <div className="outboundRulesContainerMiddleRules">
          {/* Add New Rule Element */}
          {addNewRule && (
            <div className="outboundRulesContainerMiddleRulesRuleContainer">
              <div className="outboundRulesContainerMiddleRulesRuleContainerDivider">
                <div className="outboundRulesContainerMiddleRulesRuleContainerDividerPart">
                  {/* Rule Number */}
                  <div className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleNr">
                    <p className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleNrText">
                      Rule
                    </p>
                    <p className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleNrNumber">
                      {rules.length + 1}
                    </p>
                  </div>

                  <div className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainer">
                    {/* Action - static value (Deny) */}
                    <div className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerAction">
                      <p className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerActionText">
                        Deny
                      </p>
                    </div>
                    {/* Protocol choose option input */}
                    <div className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerProtocol">
                      <select
                        value={protocol}
                        className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerProtocolSelect"
                        onChange={(e) => setProtocol(e.target.value)} // Poprawka tutaj
                      >
                        <option value="">Select Protocol</option>
                        <option value="TCP">TCP</option>
                        <option value="UDP">UDP</option>
                        <option value="ICMP">ICMP</option>
                        <option value="Other">Other</option>
                      </select>

                      {protocol === "Other" && (
                        <div className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerProtocolCustom">
                          <input
                            type="text"
                            className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerProtocolCustomInput"
                            onChange={(e) => setProtocolTwo(e.target.value)}
                            placeholder="Enter Protocol"
                          />
                        </div>
                      )}
                    </div>

                    {/* Source - choose of any or custom */}
                    <div className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerSource">
                      <select
                        value={source}
                        className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerSourceSelect"
                        onChange={(e) => setSource(e.target.value)}
                      >
                        <option value="">Select source address</option>
                        <option value="Any">Any</option>
                        <option value="Custom">Custom</option>
                      </select>
                      {source === "Custom" && (
                        <div className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerSourceInputCustom">
                          <input
                            type="text"
                            onChange={(e) => setSourceTwo(e.target.value)}
                            className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerSourceInput"
                            placeholder="Enter Source"
                          />
                        </div>
                      )}
                    </div>

                    {/* Destination address */}
                    <div className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerDestination">
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerDestinationSelect"
                      >
                        <option value="">Select destination address</option>
                        <option value="Any">Any</option>
                        <option value="Custom">Custom</option>
                      </select>
                      {destination === "Custom" && (
                        <div className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerDestinationCustom">
                          <input
                            type="text"
                            className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerDestinationInput"
                            onChange={(e) => setDestinationTwo(e.target.value)}
                            placeholder="Enter destination"
                          />
                        </div>
                      )}
                    </div>

                    {/* Port */}
                    <div className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerPort">
                      <select
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerSelect"
                      >
                        <option value="">Select Port</option>
                        <option value="53">53</option>
                        <option value="80">80</option>
                        <option value="Custom">Custom</option>
                      </select>
                      {port === "Custom" && (
                        <div className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerPortCustom">
                          <input
                            type="text"
                            placeholder="Enter Port"
                            className="outboundRulesContainerMiddleRulesRuleContainerDividerPartRuleTwoContainerPortCustomInput"
                            onChange={(e) => setPortTwo(e.target.value)} // Poprawka tutaj
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="outboundRulesContainerMiddleRulesRuleContainerCloseAccept">
                  <div className="outboundRulesContainerMiddleRulesRuleContainerCloseAcceptClose">
                    <img
                      src={assets.close}
                      alt=""
                      className="outboundRulesContainerMiddleRulesRuleContainerCloseAcceptCloseIcon"
                      onClick={handleClose}
                    />
                  </div>

                  <div className="outboundRulesContainerMiddleRulesRuleContainerCloseAcceptAccept">
                    <img
                      src={assets.accept}
                      className="outboundRulesContainerMiddleRulesRuleContainerCloseAcceptAcceptIcon"
                      onClick={handleAddRule} // Poprawka tutaj
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {filteredRules.map((rule) => (
            <ACLElement
              key={rule.id}
              id={rule.id}
              action={rule.action}
              protocol={rule.protocol}
              source={rule.source}
              destination={rule.destination}
              port={rule.port}
              onEdit={editRule} // Pass the editRule function here
              onDelete={() => removeRule(rule.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutboundRules;