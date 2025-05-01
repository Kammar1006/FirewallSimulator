import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { RulesContext } from "../../context/RulesContext";
import Console from "../../components/Console/Console";
import "./taskDetails.css";

import assets from "../../assets/assets";

const TaskDetails = () => {
    const { taskId } = useParams();
    const { socket } = useContext(RulesContext);
    const [task, setTask] = useState(null);
    const [openConsoles, setOpenConsoles] = useState([]);
    const [consoleOutput, setConsoleOutput] = useState({});
    const [testResults, setTestResults] = useState([]);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [devicePositions, setDevicePositions] = useState({});

    const predefinedPositions = {
        1: {
            0: { x: 200, y: 100 },  // PC_1
            1: { x: 400, y: 100 }, // S_1
            2: { x: 600, y: 100 }, // R_1
            3: { x: 800, y: 100 }, // PC_2
            4: { x: 1000, y: 100 }, // PC_3
        },
        2: {
            0: { x: 200, y: 100 },  // PC_A
            1: { x: 400, y: 100 }, // R_A
            2: { x: 600, y: 100 }, // R_B
            3: { x: 800, y: 100 }, // PC_B
            4: { x: 1000, y: 100 }, // PC_C
            5: { x: 600, y: 300 }, // S_1
        },
        3: {
            0: { x: 200, y: 100 },  // PC_X
            1: { x: 400, y: 100 }, // R_X
            2: { x: 600, y: 100 }, // R_Y
            3: { x: 800, y: 100 }, // PC_Y
            4: { x: 1000, y: 100 }, // PC_Z
            5: { x: 600, y: 300 }, // S_2
            6: { x: 800, y: 300 }, // R_Z
            7: { x: 1000, y: 300 }, // PC_W
        },
        4: {
            0: { x: 200, y: 100 },  // PC_1
            1: { x: 400, y: 100 }, // R_1
            2: { x: 600, y: 100 }, // R_2
            3: { x: 800, y: 100 }, // PC_2
            4: { x: 1000, y: 100 }, // PC_3
            5: { x: 600, y: 300 }, // S_1
        },
        5: {
            0: { x: 200, y: 100 },  // PC_A
            1: { x: 400, y: 100 }, // R_A
            2: { x: 600, y: 100 }, // R_B
            3: { x: 800, y: 100 }, // PC_B
            4: { x: 1000, y: 100 }, // PC_C
            5: { x: 600, y: 300 }, // S_2
            6: { x: 800, y: 300 }, // PC_D
        },
        6: {
            0: { x: 200, y: 100 },  // PC_X
            1: { x: 400, y: 100 }, // R_X
            2: { x: 600, y: 100 }, // R_Y
            3: { x: 800, y: 100 }, // PC_Y
            4: { x: 1000, y: 100 }, // PC_Z
            5: { x: 600, y: 300 }, // S_3
            6: { x: 800, y: 300 }, // PC_W
            7: { x: 1000, y: 300 }, // PC_V
        },
    };

    useEffect(() => {
        if (socket) {
            socket.emit("get_tasks");
            socket.on("tasks", (data) => {
                const taskData = data.find((task) => task.id === parseInt(taskId, 10));
                if (taskData) {
                    setTask({
                        id: taskData.id,
                        title: taskData.title || `Task ${taskId}`,
                        description: taskData.desc?.join(" ") || "No description available.",
                        difficulty: taskData.difficulty || "Unknown",
                        subtasks: taskData.subtasks || [],
                        topology: taskData.topology || { devices: [], connections: [] },
                    });
                } else {
                    console.error(`Task with ID ${taskId} not found.`);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off("tasks");
            }
        };
    }, [socket, taskId]);

    useEffect(() => {
        if (task && task.topology && task.topology.devices) {
            const positions = {};
            task.topology.devices.forEach((device, index) => {
                const position = predefinedPositions[taskId]?.[index];
                if (position) {
                    positions[index] = position;
                }
            });
            setDevicePositions(positions);
        }
    }, [taskId, task]);

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

    const handleRunTests = () => {
        if (socket) {
            socket.emit("check_task_completion");
            socket.once("task_completion_status", ({ isCompleted }) => {
                setTaskCompleted(isCompleted);
                setTestResults([
                    {
                        id: 1,
                        description: "All tests passed successfully.",
                        status: isCompleted ? "PASSED" : "FAILED",
                    },
                ]);
            });
        }
    };

    const handleSubmit = () => {
        if (taskCompleted && socket) {
            socket.emit("submit_task", { taskId: task.id });
            alert("Task submitted successfully!");
        } else {
            alert("Complete the task correctly before submitting.");
        }
    };

    const getDeviceIcon = (name) => {
        if (name.startsWith("PC")) return <img src={assets.pcIcon} alt="" className="taskDetailsPcIcon" />;
        if (name.startsWith("R")) return <img src={assets.routerIcon} alt="" className="taskDetailsRouterIcon" />;
        if (name.startsWith("S")) return <img src={assets.switchIcon} alt="" className="taskDetailsSwitchIcon" />;
        return "❓"
    };

    const renderConnections = () => {
        if (!task || !task.topology || !task.topology.connections) return null;

        return task.topology.connections.map((conn, index) => {
            const sourcePos = predefinedPositions[taskId]?.[conn.source];
            const targetPos = predefinedPositions[taskId]?.[conn.target];

            if (sourcePos && targetPos) {
                return (
                    <line
                        key={index}
                        x1={sourcePos.x + 25}
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

    if (!task) {
        return <div className="taskDetails">Loading...</div>;
    }

    return (
        <div className="taskDetails">
            <div className="taskDetailsContainer">
                {/* Top Part */}
                <div className="taskDetailsContainerTop">
                    {/* First Element */}
                    <div className="taskDetailsContainerTopFirst">
                        <div className="taskDetailsContainerTopFirstContainer">
                            {/* Left Part */}
                            <div className="taskDetailsContainerTopFirstContainerLeft">
                                <p className="taskDetailsContainerTopFirstContainerLeftText">
                                    Task #{task.id}: {task.title}
                                </p>
                            </div>

                            {/* Right Part */}
                            <div className="taskDetailsContainerTopFirstContainerRight">
                                <div className="taskDetailsContainerTopFirstContainerRightContainer">
                                    <button
                                        className="taskDetailsContainerTopFirstContainerRightContainerBtnOne"
                                        onClick={handleRunTests}
                                    >
                                        <p className="taskDetailsContainerTopFirstContainerRightContainerBtnOneText">
                                            Run Tests
                                        </p>
                                    </button>
                                    <button
                                        className={`taskDetailsContainerTopFirstContainerRightContainerBtn ${taskCompleted ? "enabled" : "disabled"}`}
                                        onClick={handleSubmit}
                                        disabled={!taskCompleted}
                                    >
                                        <p className="taskDetailsContainerTopFirstContainerRightContainerBtnText">
                                            Submit
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Second Element */}
                    <div className="taskDetailsContainerTopElement">
                        <div className="taskDetailsContainerTopElementContainer">
                            {/* First Part */}
                            <div className="taskDetailsContainerTopElementContainerFirst">
                                <div className="taskDetailsContainerTopElementContainerFirstContainer">
                                    <div className="taskDetailsContainerTopElementContainerFirstContainerDiv">
                                        <p className="taskDetailsContainerTopElementContainerFirstContainerDivText">
                                            Difficulty: {task.difficulty}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Second Part */}
                            <div className="taskDetailsContainerTopElementContainerSecond">
                                <div className="taskDetailsContainerTopElementContainerSecondContainer">
                                    <p className="taskDetailsContainerTopElementContainerSecondContainerText">
                                        Time: 45 minutes
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Third Element */}
                    <div className="taskDetailsContainerTopThird">
                        <div className="taskDetailsContainerTopThirdContainer">
                            <p className="taskDetailsContainerTopThirdContainerText">
                                Configure the firewall rules for a secure network environment following the given requirements:
                            </p>
                        </div>
                    </div>

                    {/* Fourth Element */}
                    <div className="taskDetailsContainerTopFourth">
                        <div className="taskDetailsContainerTopFourthContainer">
                            {task.subtasks && task.subtasks.map((subtask) => (
                                <div key={subtask.id} className="taskDetailsContainerTopFourthContainerSubtask">
                                    <img src={assets.dotIcon} alt="" className="taskDetailsContainerTopFourthContainerSubtaskDotIcon" />
                                    <p className="taskDetailsContainerTopFourthContainerSubtaskText">
                                        {subtask.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Part */}
                <div className="taskDetailsContainerBottom">
                    <div className="taskDetailsContainerBottomContainer">
                        <svg className="taskDetailsContainerBottomContainerSvg">
                            {renderConnections()}
                        </svg>
                        {task.topology && task.topology.devices && task.topology.devices.map((device, index) => {
                            const position = predefinedPositions[taskId]?.[index];
                            return (
                                <div
                                    key={index}
                                    className="deviceIcon"
                                    style={{
                                        left: position?.x || 0,
                                        top: position?.y || 0,
                                    }}
                                    onClick={() => openConsole(index)}
                                >
                                    {getDeviceIcon(device.name)}
                                    <p>{device.name}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Test Results */}
                {testResults.length > 0 && (
                    <div className="testResults">
                        <h3>Test Results</h3>
                        {testResults.map((result) => (
                            <div key={result.id} className={`testResult ${result.status.toLowerCase()}`}>
                                <p>{result.description}</p>
                                <p className="status">{result.status}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Render all open consoles */}
            {task.topology && task.topology.devices && openConsoles.map((deviceId) => (
                <Console
                    key={deviceId}
                    deviceName={task.topology.devices[deviceId].name}
                    deviceId={deviceId}
                    onClose={() => closeConsole(deviceId)}
                    onCommand={handleConsoleCommand}
                    output={consoleOutput[deviceId]}
                />
            ))}
        </div>
    );
};

export default TaskDetails;