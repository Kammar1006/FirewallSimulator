import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import "./console.css";

const Console = ({ deviceName, deviceId, onClose, onCommand, output }) => {
    const [input, setInput] = useState("");
    const consoleRef = useRef(null);

    const handleSendCommand = () => {
        if (input.trim()) {
            onCommand(deviceId, input);
            setInput(""); // Clear input after sending
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendCommand();
        }
    };

    return (
        <Draggable handle=".consoleTitleBar" nodeRef={consoleRef}>
            <div className="consoleModal" ref={consoleRef}>
                <div className="consoleTitleBar">
                    <span>Console: {deviceName}</span>
                    <button onClick={onClose} className="closeButton">X</button>
                </div>
                <div className="consoleContent">
                    <div className="consoleOutput">
                        <pre>{output || "No output yet..."}</pre>
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter command"
                    />
                </div>
            </div>
        </Draggable>
    );
};

export default Console;
