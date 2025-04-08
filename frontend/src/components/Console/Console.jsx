import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import "./console.css";

const Console = ({ deviceName, deviceId, onClose, onCommand, output }) => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]); // Historia poleceń
    const [historyIndex, setHistoryIndex] = useState(-1); // Nawigacja po historii
    const consoleRef = useRef(null);

    const handleSendCommand = () => {
        if (input.trim()) {
            onCommand(deviceId, input); // Send command to backend
            setHistory((prev) => [...prev, input]); // Add to history
            setInput(""); // Clear input
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
            // Nawigacja w górę po historii
            if (historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(history[history.length - 1 - newIndex]);
            }
        } else if (e.key === "ArrowDown") {
            // Nawigacja w dół po historii
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
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight; // Automatyczne przewijanie do dołu
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
                    <div className="consolePrompt">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter command"
                        />
                    </div>
                    <div className="consoleActions">
                        <button onClick={() => onCommand(deviceId, "run_tests")}>
                            Run Tests
                        </button>
                    </div>
                </div>
            </div>
        </Draggable>
    );
};

export default Console;
