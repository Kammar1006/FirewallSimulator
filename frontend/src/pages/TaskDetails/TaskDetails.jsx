import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { RulesContext } from "../../context/RulesContext";
import Console from "../../components/Console/Console";
import "./taskDetails.css";

const TaskDetails = () => {
    const { taskId } = useParams();
    const { socket } = useContext(RulesContext);
    const [task, setTask] = useState(null);
    const [openConsoles, setOpenConsoles] = useState([]);
    const [consoleOutput, setConsoleOutput] = useState({});

    const predefinedPositions = {
        1: {
            0: { x: 10, y: 150 },  // PC_1
            1: { x: 200, y: 150 }, // R_1
            2: { x: 350, y: 150 }, // R_2
            3: { x: 350, y: 300 }, // PC_2
            4: { x: 500, y: 150 }, // PC_3
        },
        // Add predefined positions for other tasks here...
    };

    useEffect(() => {
        if (socket) {
            socket.emit("get_tasks");
            socket.on("tasks", (data) => {
                const taskData = {
                    id: taskId,
                    description: data.desc[taskId - 1] || "No description available.",
                    difficulty: ["Easy", "Medium", "Hard"][(taskId - 1) % 3],
                    subtasks: data.subtasks || [],
                    topology: data.topology || {},
                };

                setTask(taskData);
            });
        }

        return () => {
            if (socket) {
                socket.off("tasks");
            }
        };
    }, [socket, taskId]);

    const openConsole = (deviceId) => {
        if (!openConsoles.includes(deviceId)) {
            setOpenConsoles((prev) => [...prev, deviceId]);
        }
    };

    const closeConsole = (deviceId) => {
        setOpenConsoles((prev) => prev.filter((id) => id !== deviceId));
    };

    const handleConsoleCommand = (deviceId, command) => {
        if (socket) {
            socket.emit("console_command", { deviceId, command });
            socket.once("console_output", (data) => {
                setConsoleOutput((prevState) => ({
                    ...prevState,
                    [deviceId]: (prevState[deviceId] || "") + `\n> ${command}\n${data.output}`,
                }));
            });
        }
    };

    const getDeviceIcon = (name) => {
        if (name.startsWith("PC")) return "💻"; // Icon for PC
        if (name.startsWith("R")) return "📡"; // Icon for Router
        if (name.startsWith("S")) return "🔀"; // Icon for Switch
        return "❓"; // Default icon
    };

    const renderConnections = () => {
        if (!task || !task.topology) return null;

        return task.topology.connections.map((conn, index) => {
            const sourcePos = predefinedPositions[taskId]?.[conn.source];
            const targetPos = predefinedPositions[taskId]?.[conn.target];

            if (sourcePos && targetPos) {
                return (
                    <line
                        key={index}
                        x1={sourcePos.x + 25} // Adjust for device center
                        y1={sourcePos.y + 25}
                        x2={targetPos.x + 25}
                        y2={targetPos.y + 25}
                        stroke="black"
                        strokeWidth="2"
                    />
                );
            }
            return null;
        });
    };

    return (
        <div className="taskDetailsContainer">
            {task ? (
                <>
                    <h2>Task {task.id}</h2>
                    <p>{task.description}</p>
                    <p><strong>Difficulty:</strong> {task.difficulty}</p>
                    <h3>Subtasks</h3>
                    <ul>
                        {task.subtasks.map((subtask) => (
                            <li key={subtask.id}>
                                <h4>{subtask.title}</h4>
                                <p>{subtask.description}</p>
                            </li>
                        ))}
                    </ul>
                    <h3>Network Topology</h3>
                    <div className="networkTopology">
                        <svg width="600" height="400">
                            {renderConnections()}
                        </svg>
                        {task.topology.devices.map((device, index) => {
                            const position = predefinedPositions[taskId]?.[index];
                            return (
                                <div
                                    key={index}
                                    className="deviceIcon"
                                    style={{
                                        position: "absolute",
                                        left: position.x,
                                        top: position.y,
                                        cursor: "pointer",
                                    }}
                                    onClick={() => openConsole(index)}
                                >
                                    <span>{getDeviceIcon(device.name)}</span>
                                    <p>{device.name}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Render all open consoles */}
                    {openConsoles.map((deviceId) => (
                        <Console
                            key={deviceId}
                            deviceName={task.topology.devices[deviceId].name}
                            deviceId={deviceId}
                            onClose={() => closeConsole(deviceId)}
                            onCommand={handleConsoleCommand}
                            output={consoleOutput[deviceId]}
                        />
                    ))}
                </>
            ) : (
                <p>Loading task details...</p>
            )}
        </div>
    );
};

export default TaskDetails;
