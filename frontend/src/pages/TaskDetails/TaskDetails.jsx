import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { RulesContext } from "../../context/RulesContext";
import Console from "../../components/Console/Console";
import "./taskDetails.css";
import { GrFormNext } from "react-icons/gr";

import assets from "../../assets/assets";
import { GrFormPrevious } from "react-icons/gr";

const TaskDetails = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { socket } = useContext(RulesContext);
    const [task, setTask] = useState(null);
    const [openConsoles, setOpenConsoles] = useState([]);
    const [consoleOutput, setConsoleOutput] = useState({});
    const [testResults, setTestResults] = useState([]);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [hoveredDevice, setHoveredDevice] = useState(null); // Track hovered device

    const predefinedPositions = {
        1: {
            0: { x: 200, y: 100 },  // PC_1
            1: { x: 400, y: 100 }, // R_1
            2: { x: 650, y: 100 }, // R_2
            3: { x: 650, y: 250 }, // PC_2
            4: { x: 900, y: 100 }, // PC_3
        },
        // Add predefined positions for other tasks here...
    };

    useEffect(() => {
        if (socket) {
            socket.emit("get_task", parseInt(taskId, 10));
            socket.on("task", (data) => {
                setTask(data);
            });
        }

        return () => {
            if (socket) {
                socket.off("task");
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
        return ""
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

    return (
        <div className="taskDetails">
            {task && task.topology && task.topology.devices ? ( 
                <>
                {/* Navigation Buttons */}
                <div className="taskDetailsNavigation">

                            <div
                                className="taskDetailsBackButton"
                                onClick={() => navigate("/tasks")}
                            >
                                <GrFormPrevious className="taskDetailsBackButtonIcon" />
                                <p className="taskDetailsBackButtonText">
                                    Back to Tasks
                                </p>
                            </div>
                            
                            <div
                                className="taskDetailsNextButton"
                                onClick={() => navigate(`/task/${parseInt(taskId, 10) + 1}`)}
                            >
                                {/* <GrFormNext /> */}
                                <p className="taskDetailsNextButtonText">
                                    Next Task
                                </p>
                                <GrFormNext className="taskDetailsNextButtonIcon" />
                            </div>
                        </div>

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
                                    {
                                        task.subtasks.map((subtask) => (
                                            <div key={subtask.id} className="taskDetailsContainerTopFourthContainerSubtask">
                                                <img src={assets.dotIcon} alt="" className="taskDetailsContainerTopFourthContainerSubtaskDotIcon" />
                                                <p className="taskDetailsContainerTopFourthContainerSubtaskText">
                                                    {subtask.description}
                                                </p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Bottom Part */}
                        <div className="taskDetailsContainerBottom">
                            <div className="taskDetailsContainerBottomContainer">
                                <svg className="taskDetailsContainerBottomContainerSvg">
                                    {renderConnections()}
                                </svg>
                                {task.topology.devices.map((device, index) => {
                                    const position = predefinedPositions[taskId]?.[index];
                                    return (
                                        <div
                                            key={index}
                                            className="deviceIcon"
                                            style={{
                                                left: position?.x || 0,
                                                top: position?.y || 0,
                                            }}
                                            onMouseEnter={(e) =>
                                                setHoveredDevice({
                                                    name: device.name,
                                                    interfaces: device.interfaces,
                                                    x: e.clientX + 10,
                                                    y: e.clientY + 10,
                                                })
                                            }
                                            onMouseLeave={() => setHoveredDevice(null)}
                                            onClick={() => openConsole(index)}
                                        >
                                            <p className="taskDetailsContainerBottomContainerSvgText">{getDeviceIcon(device.name)}</p>
                                            <p>{device.name}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* Tooltip */}
                    {hoveredDevice && (
                        <div
                            className="deviceTooltip"
                            style={{
                                left: `${hoveredDevice.x}px`,
                                top: `${hoveredDevice.y}px`,
                            }}
                        >
                            <p><strong>{hoveredDevice.name}</strong></p>
                            {hoveredDevice.interfaces.map((ip, index) => (
                                <p key={index}>IP: {ip || "N/A"}</p>
                            ))}
                        </div>
                    )}

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

                    {/* {testResults.length > 0 && (
                        <div className="testResults">
                            <h3>Test Results:</h3>
                            <ul>
                                {testResults.map((result, index) => (
                                    <li key={index}></li>
                                        Test {index + 1}: {result.passed ? "PASSED" : "FAILED"}
                                        <br />
                                        Expected: {JSON.stringify(result.test.result)}
                                        <br />
                                        Actual: {JSON.stringify(result.actual)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {taskCompleted && (
                        <div className="taskCompletedMessage">
                            <p>ask Completed Successfully!</p>
                        </div>
                    )} */}
                </>
            ) : (
                <p>Loading task details...</p>
            )}
        </div>
    );
};

export default TaskDetails;
