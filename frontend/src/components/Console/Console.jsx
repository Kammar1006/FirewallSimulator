import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import "./console.css";

const Console = ({ deviceName, deviceId, onClose, onCommand, output }) => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [mode, setMode] = useState("");
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
            setHistory((prev) => [...prev, `${getPrompt()} ${command}`]);

            if(command == "clear"){
                setHistory([]);
                //setOutput("");
            }
            onCommand(deviceId, command);

            setInput("");
            setHistoryIndex(-1);
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
        if (output === "") {
            setHistory([]);
        }
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
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
                    <div className="consoleOutput" ref={outputRef}>
                        <pre>
                            {/* {history.map((cmd, index) => (
                                <div key={index}>{cmd}</div>
                            ))} */}
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
