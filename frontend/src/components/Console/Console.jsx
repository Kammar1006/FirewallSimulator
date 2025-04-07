import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import "./console.css";

const Console = ({ deviceName, deviceId, onClose, onCommand, output }) => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]); // Command history
    const [historyIndex, setHistoryIndex] = useState(-1); // Track history navigation
    const consoleRef = useRef(null);

    const handleSendCommand = () => {
        if (input.trim()) {
            onCommand(deviceId, input);
            setHistory((prev) => [...prev, input]); // Add command to history
            setInput(""); // Clear input after sending
            setHistoryIndex(-1); // Reset history navigation
        }
    };

    const handleConsoleCommand = (deviceId, command) => {
        if (socket) {
            socket.emit("console_command", { deviceId, command });
            socket.once("console_output", (data) => {
                setConsoleOutput((prevState) => ({
                    ...prevState,
                    [deviceId]: (prevState[deviceId] || "") + `\n> ${command}\n${data.output}`, // Append command and output
                }));
            });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendCommand();
        } else if (e.key === "ArrowUp") {
            // Navigate up in history
            if (historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(history[history.length - 1 - newIndex]);
            }
        } else if (e.key === "ArrowDown") {
            // Navigate down in history
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(history[history.length - 1 - newIndex]);
            } else {
                setHistoryIndex(-1);
                setInput("");
            }
        }
    };

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight; // Auto-scroll to the bottom
        }
    }, [output]);

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
