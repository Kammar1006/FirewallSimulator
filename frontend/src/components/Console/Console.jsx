import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import "./console.css";

const Console = ({ deviceName, deviceId, onClose, onCommand, output }) => {
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [mode, setMode] = useState("");
    const [dimensions, setDimensions] = useState({ width: 760, height: 360 });
    const [isResizing, setIsResizing] = useState(false);
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

    const handleResize = (e, direction) => {
        if (!isResizing) return;
        
        const newDimensions = { ...dimensions };
        const rect = consoleRef.current.getBoundingClientRect();
        
        if (direction.includes('right')) {
            newDimensions.width = Math.max(820, e.clientX - rect.left);
        }
        if (direction.includes('bottom')) {
            newDimensions.height = Math.max(400, e.clientY - rect.top);
        }
        
        setDimensions(newDimensions);
    };

    const startResize = () => setIsResizing(true);
    const stopResize = () => setIsResizing(false);

    useEffect(() => {
        if (output === "") {
            setHistory([]);
        }
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mouseup', stopResize);
            window.addEventListener('mousemove', (e) => handleResize(e, 'right bottom'));
        }
        return () => {
            window.removeEventListener('mouseup', stopResize);
            window.removeEventListener('mousemove', (e) => handleResize(e, 'right bottom'));
        };
    }, [isResizing]);

    return (
        <Draggable 
            handle=".consoleTitleBar" 
            nodeRef={consoleRef}
            bounds="body"
        >
            <div 
                className="consoleModal" 
                ref={consoleRef}
                style={{ width: dimensions.width, height: dimensions.height }}
            >
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
                <div 
                    className="resize-handle"
                    onMouseDown={startResize}
                />
            </div>
        </Draggable>
    );
};

export default Console;
