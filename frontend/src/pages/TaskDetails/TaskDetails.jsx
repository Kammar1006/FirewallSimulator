import React, { useEffect, useState, forwardRef } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { RulesContext } from "../../context/RulesContext";
import Console from "../../components/Console/Console";
import Draggable from "react-draggable";
import "./taskDetails.css";

const TaskDetails = () => {
    const { taskId } = useParams();
    const { socket } = useContext(RulesContext);
    const [task, setTask] = useState(null);
    const [openConsoles, setOpenConsoles] = useState([]); // Track open consoles
    const [consoleOutput, setConsoleOutput] = useState({}); // Output for each device console
    const [devicePositions, setDevicePositions] = useState({}); // Store device positions

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

                // Initialize device positions
                const initialPositions = {};
                taskData.topology.devices.forEach((_, index) => {
                    initialPositions[index] = {
                        x: 100 + (index % 3) * 150, // Spread devices horizontally
                        y: 100 + Math.floor(index / 3) * 150, // Spread devices vertically
                    };
                });

                setTask(taskData);
                setDevicePositions(initialPositions);
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
                    [deviceId]: (prevState[deviceId] || "") + `\n> ${command}\n${data.output}`, // Append command and output
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

    const handleDragStop = (deviceId, e, data) => {
        // Update the position of the dragged device
        setDevicePositions((prev) => ({
            ...prev,
            [deviceId]: { x: data.x, y: data.y },
        }));
    };

    const DraggableDevice = forwardRef(({ device, onClick, position, deviceId }, ref) => {
        const [dragged, setDragged] = useState(false);

        const handleStart = () => {
            setDragged(false); // Reset drag state on drag start
        };

        const handleDrag = () => {
            setDragged(true); // Mark as dragged when movement occurs
        };

        const handleStop = (e, data) => {
            if (!dragged) {
                onClick(); // Open console only if not dragged
            }
            handleDragStop(deviceId, e, data); // Update position
        };

        return (
            <Draggable
                nodeRef={ref}
                position={position}
                onStart={handleStart}
                onDrag={handleDrag}
                onStop={handleStop}
            >
                <div
                    ref={ref}
                    className="deviceIcon"
                    style={{ cursor: "pointer" }}
                >
                    <span>{getDeviceIcon(device.name)}</span>
                    <p>{device.name}</p>
                </div>
            </Draggable>
        );
    });

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
                            {task.topology.connections.map((conn, index) => {
                                const sourcePos = devicePositions[conn.source];
                                const targetPos = devicePositions[conn.target];
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
                            })}
                        </svg>
                        {task.topology.devices.map((device, index) => {
                            const ref = React.createRef();
                            const position = devicePositions[index];
                            return (
                                <DraggableDevice
                                    key={index}
                                    ref={ref}
                                    device={device}
                                    position={position}
                                    deviceId={index}
                                    onClick={() => openConsole(index)}
                                />
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
