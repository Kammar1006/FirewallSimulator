import React, { useState } from "react";
import "./aCLElement.css";

const ACLElement = ({ id, action, protocol, source, destination, port, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRule, setEditedRule] = useState({ id, action, protocol, source, destination, port });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedRule({ ...editedRule, [name]: value });
  };

  const handleEditSubmit = () => {
    onEdit(editedRule);
    setIsEditing(false);
  };

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
              <div className="aCLElementContainerMiddleAction">
                <p
                  className={`aCLElementContainerMiddleActionText ${
                    action === "Allow" ? "aCLElementContainerMiddleActionTextAllow" : "aCLElementContainerMiddleActionTextDeny"
                  }`}
                >
                  {action}
                </p>
              </div>
              <input
                type="text"
                name="protocol"
                value={editedRule.protocol}
                onChange={handleEditChange}
                className="aCLElementContainerMiddleInputProtocl"
              />
              <input
                type="text"
                name="source"
                value={editedRule.source}
                onChange={handleEditChange}
                className="aCLElementContainerMiddleInputSource"
              />
              <input
                type="text"
                name="destination"
                value={editedRule.destination}
                onChange={handleEditChange}
                className="aCLElementContainerMiddleInputDestination"
              />
              <input type="text" name="port" value={editedRule.port} onChange={handleEditChange} className="aCLElementContainerMiddleInputPort" />
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
            <button className="aCLElementContainerRightEditBtn" onClick={handleEditSubmit}>
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
