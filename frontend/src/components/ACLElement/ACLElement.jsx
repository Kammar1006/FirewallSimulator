import React, { useState } from "react";
import "./aCLElement.css";

const ACLElement = ({ id, action, protocol, source, destination, port, onEdit, onDelete }) => {

  const [isEditing, setIsEditing] = useState(false);

  const [editProtocol, setEditProtocol] = useState(protocol);
  const [editProtocolTwo, setEditProtocolTwo] = useState("");
  const [editSource, setEditSource] = useState(source);
  const [editSourceTwo, setEditSourceTwo] = useState("");
  const [editDestination, setEditDestination] = useState(destination);
  const [editDestinationTwo, setEditDestinationTwo] = useState("");
  const [editPort, setEditPort] = useState(port);
  const [editPortTwo, setEditPortTwo] = useState("");


  const handleSave = () => {
    const updatedRule = {
      id,
      action,
      protocol: editProtocol === "Custom" ? editProtocolTwo : editProtocol,
      source: editSource === "Custom" ? editSourceTwo : editSource,
      destination: editDestination === "Custom" ? editDestinationTwo : editDestination,
      port: editPort === "Custom" ? editPortTwo : editPort,
    }

    onEdit(updatedRule);
    setIsEditing(false);
  }



  return (
    <div className="aCLElement">
      <div className="aCLElementContainer">
        {/* Left Part */}
        <div className="aCLElementContainerLeft">
          {/* Number of rule info */}
          <div className="aCLElementContainerLeftNumer">
            <p className="aCLElementContainerLeftNumerText">Rule {id}</p>
          </div>
        </div>

        {/* Middle Part */}
        <div className="aCLElementContainerMiddle">
          {isEditing ? (
            <>

            <div className="aCLElementContainerMiddleContainerEdit">

              <div className="aCLElementContainerMiddleAction">
                  <p
                    className={`aCLElementContainerMiddleActionText ${
                      action === "Allow" ? "aCLElementContainerMiddleActionTextAllow" : "aCLElementContainerMiddleActionTextDeny"
                    }`}
                  >
                    {action}
                  </p>
                </div>


                <div className="aCLElementContainerMiddleContainerEditProtocol">
                  <select value={editProtocol} onChange={(e) => setEditProtocol(e.target.value)}>
                    <option value="">Select Protocol</option>
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="ICMP">ICMP</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {
                    editProtocol === "Custom" && (
                      <input
                        type="text"
                        value={editProtocolTwo}
                        onChange={(e) => setEditProtocolTwo(e.target.value)}
                        placeholder="Enter Protocol"
                    />)
                  }
                </div>

                <div className="aCLElementContainerMiddleContainerEditSource">
                  <select value={editSource} onChange={(e) => setEditSource(e.target.value)}>
                    <option value="">Select Source</option>
                    <option value="any">any</option>
                    <option value="Custom">Custom</option>
                  </select>

                  {
                    editSource === "Custom" && (
                      <input
                        type="text"
                        value={editSourceTwo}
                        onChange={(e) => setEditSourceTwo(e.target.value)}
                        placeholder="Enter Source"
                        />
                    )
                  }
                </div>

                <div className="aCLElementContainerMiddleContainerEditDesination">
                  <select value={editDestination} onChange={(e) => setEditDestination(e.target.value)}>
                    <option value="">Select Destination</option>
                    <option value="any">any</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {
                    editDestination === "Custom" && (
                      <input
                        type="text"
                        value={editDestinationTwo}
                        onChange={(e) => setEditDestinationTwo(e.target.value)}
                        placeholder="Enter Destination"
                        />
                    )
                  }
                </div>


                <div className="aCLElementContainerMiddleContainerEditPort">
                  <select value={editPort} onChange={(e) => setEditPort(e.target.value)} className="aCLElementContainerMiddleContainerEditPortSelect">
                    <option value="">Select Port</option>
                    <option value="Any">Any</option>
                    <option value="Custom">Custom</option>
                  </select>
                  {
                    editPort === "Custom" && (
                      <input
                        type="text"
                        value={editPortTwo}
                        onChange={(e) => setEditPortTwo(e.target.value)}
                        placeholder="Enter Port"
                        className="aCLElementContainerMiddleContainerEditPortInput"
                        />
                    )
                  }
                </div>




            </div>

            </>
          ) : (
            <>
              <div className="aCLElementContainerMiddleAction">
                <p
                  className={`aCLElementContainerMiddleActionText ${
                    action === "Allow" ? "aCLElementContainerMiddleActionTextAllow" : "aCLElementContainerMiddleActionTextDeny"
                  }`}
                >
                  {action}
                </p>
              </div>
              <div className="aCLElementContainerMiddleProtocol">
                <p className="aCLElementContainerMiddleProtocolText">{protocol}</p>
              </div>
              <div className="aCLElementContainerMiddleSource">
                <p className="aCLElementContainerMiddleSourceText">{source}</p>
              </div>
              <div className="aCLElementContainerMiddleDestination">
                <p className="aCLElementContainerMiddleDestinationText">{destination}</p>
              </div>
              <div className="aCLElementContainerMiddlePort">
                <p className="aCLElementContainerMiddlePortText">Port:</p>
                <p className="aCLElementContainerMiddlePortPort">{port}</p>
              </div>
            </>
          )}
        </div>

        {/* Right Part */}
        <div className="aCLElementContainerRight">
          {isEditing ? (
            <button className="aCLElementContainerRightEditBtn" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="aCLElementContainerRightEditBtn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
          <button className="aCLElementContainerRightDeleteDelete" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ACLElement;
