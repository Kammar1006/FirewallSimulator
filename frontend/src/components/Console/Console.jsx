import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import "./console.css";

const Console = ({ deviceName, deviceId, onClose, onCommand, output }) => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]); // Command history
    const [historyIndex, setHistoryIndex] = useState(-1); // Navigation in history
    const [mode, setMode] = useState(""); // CLI mode (e.g., "", "privileged", "config")
    const consoleRef = useRef(null);
    const outputRef = useRef(null);

    const getPrompt = () => {
        if (mode === "config") return `${deviceName}(config)#`;
        if (mode === "privileged") return `${deviceName}#`;
        return `${deviceName}>`;
    };

    const handleSendCommand = () => {
        if (input.trim()) {
            const command = input.trim();
            setHistory((prev) => [...prev, `${getPrompt()} ${command}`]); // Add to history

            // Handle CLI modes
            if (command === "enable" || command === "en") {
                setMode("privileged");
                setHistory((prev) => [...prev, "Entering privileged EXEC mode."]);
            } else if (command === "configure terminal" || command === "conf t") {
                if (mode === "privileged") {
                    setMode("config");
                    setHistory((prev) => [...prev, "Enter configuration commands, one per line. End with CNTL/Z."]);
                } else {
                    setHistory((prev) => [...prev, "Error: Must be in privileged EXEC mode to enter configuration mode."]);
                }
            } else if (command === "end") {
                if (mode === "config") {
                    setMode("privileged");
                    setHistory((prev) => [...prev, "Exiting configuration mode."]);
                } else {
                    setHistory((prev) => [...prev, "Error: 'end' command is not valid in this mode."]);
                }
            } else if (command === "exit") {
                if (mode === "config") {
                    setMode("privileged");
                    setHistory((prev) => [...prev, "Exiting configuration mode."]);
                } else if (mode === "privileged") {
                    setMode("");
                    setHistory((prev) => [...prev, "Exiting privileged EXEC mode."]);
                } else {
                    setHistory((prev) => [...prev, "Exiting session."]);
                }
            } else {
                onCommand(deviceId, command); // Send command to backend
            }

            setInput(""); // Clear input
            setHistoryIndex(-1); // Reset history navigation
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
                setInput(history[history.length - 1 - newIndex].split(" ").slice(1).join(" "));
            }
        } else if (e.key === "ArrowDown") {
            // Navigate down in history
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(history[history.length - 1 - newIndex].split(" ").slice(1).join(" "));
            } else {
                setHistoryIndex(-1);
                setInput("");
            }
        }
    };

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight; // Auto-scroll to bottom
        }
    }, [history, output]); // Trigger on history or output changes

    return (
        <Draggable handle=".consoleTitleBar" nodeRef={consoleRef}>
            <div className="consoleModal" ref={consoleRef}>
                <div className="consoleTitleBar">
                    <span>Console: {deviceName}</span>
                    <button onClick={onClose} className="closeButton">X</button>
                </div>
                <div className="consoleContent">
                    <div className="consoleOutput" ref={outputRef}>
                        <pre>
                            {history.map((cmd, index) => (
                                <div key={index}>{cmd}</div>
                            ))}
                            {output && <div>{output}</div>}
                        </pre>
                    </div>
                    <div className="consolePrompt">
                        <span>{getPrompt()} </span>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter command"
                        />
                    </div>
                </div>
            </div>
        </Draggable>
    );
};

export default Console;
