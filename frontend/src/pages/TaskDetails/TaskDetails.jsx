import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { RulesContext } from "../../context/RulesContext";
import Console from "../../components/Console/Console";

const TaskDetails = () => {
    const { taskId } = useParams();
    const { socket } = useContext(RulesContext);
    const [task, setTask] = useState(null);
    const [openConsoles, setOpenConsoles] = useState([]); // Track open consoles
    const [consoleOutput, setConsoleOutput] = useState({}); // Output for each device console

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
            setOpenConsoles((prev) => [...prev, deviceId]); // Add device to open consoles
        }
    };

    const closeConsole = (deviceId) => {
        setOpenConsoles((prev) => prev.filter((id) => id !== deviceId)); // Remove device from open consoles
    };

    const handleConsoleCommand = (deviceId, command) => {
        if (socket) {
            socket.emit("console_command", { deviceId, command });
            socket.once("console_output", (data) => {
                setConsoleOutput((prevState) => ({
                    ...prevState,
                    [deviceId]: data.output, // Update console output for the active device
                }));
            });
        }
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
                        <svg width="500" height="500">
                            {task.topology.devices.map((device, index) => (
                                <g key={index} onClick={() => openConsole(index)} style={{ cursor: "pointer" }}>
                                    <circle
                                        cx={100 + index * 100}
                                        cy={100}
                                        r={20}
                                        fill="lightblue"
                                    />
                                    <text
                                        x={100 + index * 100}
                                        y={105}
                                        textAnchor="middle"
                                        fontSize="12"
                                    >
                                        {device.name}
                                    </text>
                                </g>
                            ))}
                            {task.topology.connections.map((conn, index) => (
                                <line
                                    key={index}
                                    x1={100 + conn.source * 100}
                                    y1={100}
                                    x2={100 + conn.target * 100}
                                    y2={100}
                                    stroke="black"
                                />
                            ))}
                        </svg>
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
