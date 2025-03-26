import React, { useContext, useState, useEffect } from "react";
import "./inboundRules.css";
import ACLElement from "../../components/ACLElement/ACLElement";
import { RulesContext } from "../../context/RulesContext.jsx";
import assets from "../../assets/assets.js";
import { useLocation } from "react-router-dom";

const InboundRules = () => {
  const {
    rules,
    addRule,
    removeRule,
    editRule,
    challenges,
    validateChallenge,
    loading,
    error,
  } = useContext(RulesContext);
  const [newRule, setNewRule] = useState({
    action: "Allow",
    protocol: "",
    source: "",
    destination: "",
    port: "",
  });
  const [loadingState, setLoadingState] = useState({});
  const [loadingAll, setLoadingAll] = useState(false);
  const [addNewRule, setAddNewRule] = useState(false);
  const [id, setId] = useState();
  const [action, setAction] = useState("Allow");
  const [protocol, setProtocol] = useState();
  const [protocolTwo, setProtocolTwo] = useState();
  const [source, setSource] = useState();
  const [sourceTwo, setSourceTwo] = useState();
  const [destination, setDestination] = useState();
  const [destinationTwo, setDestinationTwo] = useState();
  const [port, setPort] = useState();
  const [portTwo, setPortTwo] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebar, setSidebar] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const device = queryParams.get("device");

  useEffect(() => {
    if (device) {
      console.log("Device: ", device);
    } else {
      console.warn("Device parameter is missing in the URL.");
    }
  }, [device]);

  useEffect(() => {
    console.log("Challenges in Tasks component:", challenges);
  }, [challenges]);

  const handleCheck = async (challengeId) => {
    setLoadingState((prev) => ({ ...prev, [challengeId]: true }));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    validateChallenge(challengeId);
    setLoadingState((prev) => ({ ...prev, [challengeId]: false }));
  };

  const handleCheckAll = async () => {
    setLoadingAll(true);
    const updatedLoadingState = {};
    for (const challenge of challenges) {
      updatedLoadingState[challenge.id] = true;
      setLoadingState({ ...updatedLoadingState }); // Update loading state for each challenge
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
      validateChallenge(challenge.id);
      updatedLoadingState[challenge.id] = false;
      setLoadingState({ ...updatedLoadingState });
    }
    setLoadingAll(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const filteredRules = rules
    .filter((rule) => rule.action === "Allow")
    .filter((rule) => rule.device === device)
    .filter((rule) =>
      `${rule.action} ${rule.protocol} ${rule.source} ${rule.destination} ${rule.port}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const resetForm = () => {
    setAction("Allow");
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
      device,
    });
    resetForm();
  };

  const handleClose = () => {
    setAddNewRule(false);
    resetForm();
  };

  return (
    <div className="inboundRules">
      <div className="inboundRulesContainer">
        {/* Top Part */}
        <div className="inboundRulesContainerTop">
          <div className="inboundRulesContainerTopLeft">
            {/* Title */}
            <div className="inboundRulesContainerTopTitle">
              <p className="inboundRulesContainerTopTitleText">
                {/* Access Control Rules */}
                ACL Inbound Rules
              </p>
            </div>
          </div>

          <div className="inboundRulesContainerTopRight">
            {/* SearchBar */}
            <div className="inboundRulesContainerTopSearchBar">
              <input
                type="text"
                placeholder="Search Rules..."
                className="inboundRulesContainerTopSearchBarInput"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img
                src={assets.searchIcon}
                alt="Search"
                className="inboundRulesContainerTopSearchBarIcon"
              />
            </div>

            {/* Add Rule Button */}
            <div className="inboundRulesContainerTopAddRuleButton">
              <button
                className="inboundRulesContainerTopAddRuleButtonButton"
                onClick={() => setAddNewRule(true)}
              >
                Add New Rule
              </button>
            </div>
          </div>
        </div>

        {/* Headers */}
        <div className="aCLElementHeaders">
          <div className="aCLElementHeaderAction">Action</div>
          <div className="aCLElementHeaderProtocol">Protocol</div>
          <div className="aCLElementHeaderSource">Source</div>
          <div className="aCLElementHeaderDestination">Destination</div>
          <div className="aCLElementHeaderPort">Port</div>
        </div>

        {/* Middle Part - Containing Rules elements -> edit/delete */}
        <div className="inboundRulesContainerRules">
          {/* Add New Rule Element */}
          {addNewRule && (
            <div className="inboundRulesContainerRulesRuleContainer">
              <div className="inboundRulesContainerRulesRuleContainerDivider">
                <div className="inboundRulesContainerRulesRuleContainerRulesPart">
                  {/* Rule Number */}
                  <div className="inboundRulesContainerRulesRuleContainerRulesPartRuleNr">
                    <p className="inboundRulesContainerRulesRuleContainerRulesPartRuleNrText">
                      Rule
                    </p>
                    <p className="inboundRulesContainerRulesRuleContainerRulesPartRuleNrTextNr">
                      {rules.length + 1}
                    </p>
                  </div>

                  <div className="inboundRulesContainerRulesRuleContainerRulesPartTwoRuleContainer">
                    {/* Action - static value (allow) */}
                    <div className="inboundRulesContainerRulesRuleContainerRulesPartAction">
                      <p className="inboundRulesContainerRulesRuleContainerRulesPartActionText">
                        Allow
                      </p>
                    </div>

                    {/* Protocol choose option input */}
                    <div className="inboundRulesContainerRulesRuleContainerRulesPartProtocol">
                      <select
                        value={protocol}
                        onChange={(e) => setProtocol(e.target.value)}
                        className="inboundRulesContainerRulesRuleContainerRulesPartProtocolSelect"
                      >
                        <option value="">Select Protocol</option>
                        <option value="TCP">TCP</option>
                        <option value="UDP">UDP</option>
                        <option value="ICMP">ICMP</option>
                        <option value="Other">Other</option>
                      </select>

                      {protocol === "Other" && (
                        <div className="inboundRulesContainerRulesRuleContainerRulesPartProtocolInputCustom">
                          <input
                            onChange={(e) => setProtocolTwo(e.target.value)}
                            type="text"
                            className="inboundRulesContainerRulesRuleContainerRulesPartProtocolInputCustomInput"
                            placeholder="Enter Protocol"
                          />
                        </div>
                      )}
                    </div>

                    {/* Source - choose of any or custom -> if it's custom user enter ip manually */}
                    <div className="inboundRulesContainerRulesRuleContainerSource">
                      <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="inboundRulesContainerRulesRuleContainerSourceSelect"
                      >
                        <option value="">Select source address</option>
                        <option value="Any">Any</option>
                        <option value="Custom">Custom</option>
                      </select>
                      {source === "Custom" && (
                        <div className="inboundRulesContainerRulesRuleContainerSourceInputCustom">
                          <input
                            type="text"
                            onChange={(e) => setSourceTwo(e.target.value)}
                            className="inboundRulesContainerRulesRuleContainerSourceInputCustomInput"
                            placeholder="Enter Source"
                          />
                        </div>
                      )}
                    </div>

                    {/* Destination */}
                    <div className="inboundRulesContainerRulesRuleContainerDestination">
                      <select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="inboundRulesContainerRulesRuleContainerDestinationSelect"
                      >
                        <option value="">Select destination address</option>
                        <option value="Any">Any</option>
                        <option value="Custom">Custom</option>
                      </select>
                      {destination === "Custom" && (
                        <div className="inboundRulesContainerRulesRuleContainerDestinationInputCustom">
                          <input
                            type="text"
                            onChange={(e) => setDestinationTwo(e.target.value)}
                            className="inboundRulesContainerRulesRuleContainerDestinationInputCustomInput"
                            placeholder="Enter Destination"
                          />
                        </div>
                      )}
                    </div>

                    {/* Port */}
                    <div className="inboundRulesContainerRulesRuleContainerPort">
                      <select
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        className="inboundRulesContainerRulesRuleContainerPortSelect"
                      >
                        <option value="">Select Port</option>
                        <option value="53">53</option>
                        <option value="80">80</option>
                        <option value="Custom">Custom</option>
                      </select>
                      {port === "Custom" && (
                        <div className="inboundRulesContainerRulesRuleContainerPortInputCustom">
                          <input
                            type="text"
                            onChange={(e) => setPortTwo(e.target.value)}
                            className="inboundRulesContainerRulesRuleContainerPortInputCustomInput"
                            placeholder="Enter Port"
                          />
                        </div>
                      )}
                    </div>

                    {/* Add Device Input */}
                    {/* <div className="inboundRulesContainerRulesRuleContainerDevice">
                      <select
                        value={device}
                        onChange={(e) => setDevice(e.target.value)}
                        className="inboundRulesContainerRulesRuleContainerDeviceSelect"
                      >
                        <option value="">Select Device</option>
                        <option value="Device-A">Device-A</option>
                        <option value="Device-B">Device-B</option>
                        <option value="Device-C">Device-C</option>
                      </select>
                    </div> */}
                  </div>
                </div>

                <div className="inboundRulesContainerRulesRuleContainerCloseAccept">
                  <div className="inboundRulesContainerRulesRuleContainerCloseAcceptClose">
                    <img
                      src={assets.close}
                      alt=""
                      className="inboundRulesContainerRulesRuleContainerCloseAcceptCloseIcon"
                      onClick={handleClose}
                    />
                  </div>

                  <div className="inboundRulesContainerRulesRuleContainerCloseAcceptAccept">
                    <img
                      src={assets.accept}
                      alt=""
                      className="inboundRulesContainerRulesRuleContainerCloseAcceptAcceptIcon"
                      onClick={() => handleAddRule()}
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
              onEdit={editRule}
              onDelete={() => removeRule(rule.id)}
              sidebarState={sidebar}
            />
          ))}
        </div>

        {/* <div className="inboundRulesContainerSidebar">
          kfdj;sa
        </div> */}
      </div>

      <div
        className={`inboundRulesRightTasks ${
          sidebar ? "inboundRulesRightTasksOpen" : "inboundRulesRightTasksClose"
        }`}
      >
        <div className="inboundRulesRightTasksContainer">
          <div
            className="inboundRulesRightTasksContainerSidebar"
            onClick={() => setSidebar(!sidebar)}
          >
            <img
              src={assets.leftArrow}
              alt=""
              className={`inboundRulesRightTasksContainerArrowImg ${
                sidebar
                  ? "inboundRulesRightTasksContainerArrowImgClose"
                  : "inboundRulesRightTasksContainerArrowImgOpen"
              }`}
              // onClick={() => setSidebar(!sidebar)}
            />
          </div>

          <div
            className={`inboundRulesRightTasksContainerDiv ${
              sidebar
                ? "inboundRulesRightTasksContainerDivOpen"
                : "inboundRulesRightTasksContainerDivClose"
            }`}
          >
            <button
              className="tasksContainerTopRightContainerBtn"
              onClick={handleCheckAll}
              disabled={loadingAll}
            >
              {loadingAll ? <div className="spinner"></div> : <p>Check All</p>}
            </button>

            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`inboundRulesRightTasksContainerDivChallangeContainer ${
                  challenge.isCorrect === true ? "correct" : "incorrect"
                }`}
              >
                <div className="inboundRulesRightTasksContainerDivContainerRule">
                  <p className="inboundRulesRightTasksContainerDivContainerRuleText">
                    {challenge.description}
                  </p>
                </div>
                {/* <button
                            className="tasksContainerMiddleChallengeContainerBtn"
                            onClick={() => handleCheck(challenge.id)}
                            disabled={loadingState[challenge.id]

                            }
                        >
                            {loadingState[challenge.id] ? (
                                <div className="spinner"></div>
                            ) : (
                                "Check"
                            )}
                        </button> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*   const [sidebar, setSidebar] = useState(false);
       */}
    </div>
  );
};

export default InboundRules;
