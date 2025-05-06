import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { RulesContext } from "../../context/RulesContext";
import Console from "../../components/Console/Console";
import "./taskDetails.css";
import assets from "../../assets/assets";
import { IoMdMail } from "react-icons/io";
import { RiMailCloseFill } from "react-icons/ri";
import { MdMarkEmailRead } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLightbulb, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TaskDetails = () => {
    const { taskId } = useParams();
    const { socket } = useContext(RulesContext);
    const [task, setTask] = useState(null);
    const [openConsoles, setOpenConsoles] = useState([]);
    const [consoleOutput, setConsoleOutput] = useState({});
    const [testResults, setTestResults] = useState([]);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [devicePositions, setDevicePositions] = useState({});
    const [packetAnimation, setPacketAnimation] = useState(null);
    const [hoveredDevice, setHoveredDevice] = useState(null);
    const [totalTasks, setTotalTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [showHints, setShowHints] = useState(false);
    const [currentHint, setCurrentHint] = useState(0);

    const predefinedPositions = {
        1: {
            0: { x: 200, y: 100 },  // PC_1
            1: { x: 400, y: 100 }, // S_1
            2: { x: 650, y: 100 }, // R_1
            3: { x: 650, y: 250 }, // PC_2
            4: { x: 900, y: 100 }, // PC_3
        },
        2: {
            0: { x: 200, y: 100 },  // PC_A
            1: { x: 400, y: 100 },  // S_1
            2: { x: 600, y: 100 },  // R_A
            3: { x: 800, y: 100 },  // R_B
            4: { x: 600, y: 300 },  // PC_B
            5: { x: 1000, y: 100 }, // PC_C
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
            1: { x: 200, y: 200 },  // PC_2
            2: { x: 200, y: 300 },  // PC_3
            3: { x: 400, y: 200 },  // S_1
            4: { x: 600, y: 200 },  // R_1
            5: { x: 800, y: 200 },  // PC_4
        },
        5: {
            0: { x: 200, y: 100 },  // PC_A
            1: { x: 200, y: 300 },  // PC_B
            2: { x: 400, y: 200 },  // S_A
            3: { x: 600, y: 200 },  // R_A
            4: { x: 800, y: 200 },  // S_B
            5: { x: 1000, y: 100 }, // PC_C
            6: { x: 1000, y: 300 }, // PC_D
        },
        6: {
            0: { x: 200, y: 100 },  // PC_1
            1: { x: 200, y: 300 },  // PC_2
            2: { x: 400, y: 200 },  // S_1
            3: { x: 600, y: 200 },  // R_1
            4: { x: 800, y: 200 },  // R_2
            5: { x: 1000, y: 200 }, // S_2
            6: { x: 1200, y: 100 }, // PC_3
            7: { x: 1200, y: 300 }, // PC_4
        },
    };

    useEffect(() => {
        if (socket) {
            const studentId = localStorage.getItem("studentId");
            socket.emit("get_student_progress", { studentId });
            socket.on("student_progress", (data) => {
                if (data && data.progress) {
                    const taskIndex = parseInt(taskId, 10) - 1;
                    setTaskCompleted(data.progress[taskIndex] === 1);
                    setCompletedTasks(data.progress.filter(status => status === 1).length);
                    setTotalTasks(data.progress.length);
                }
            });

            socket.emit("get_tasks");
            socket.on("tasks", (data) => {
                const taskData = data.find((task) => task.id === parseInt(taskId, 10));
                if (taskData) {
                    console.log("Task data:", taskData);
                    setTask({
                        id: taskData.id,
                        title: taskData.title || `Task ${taskId}`,
                        description: taskData.desc?.join(" ") || "No description available.",
                        difficulty: taskData.difficulty || "Unknown",
                        subtasks: taskData.subtasks || [],
                        topology: taskData.topology || { devices: [], connections: [] },
                        hints: taskData.hints || [],
                    });
                    socket.emit("switch_task", parseInt(taskId, 10));
                } else {
                    console.error(`Task with ID ${taskId} not found.`);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off("student_progress");
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

            
            const args = command.split(" ");
            if (args[0].toLowerCase() === "send_packet" && args.length === 4) {
                const targetDeviceId = parseInt(args[1], 10);
                if (!isNaN(targetDeviceId) && devicePositions[deviceId] && devicePositions[targetDeviceId]) {
                    const sourcePosition = devicePositions[deviceId];
                    const targetPosition = devicePositions[targetDeviceId];

                    socket.emit("send_packet", deviceId, targetDeviceId, args[2], args[3]);
                    socket.once("packet_response", (response) => {
                        const { result, success, blockingDevice } = JSON.parse(response);
                    
                        console.log("Animacja - wyniki backendu:", result);
                    
                        const fullPath = [...result[0], ...result[1].reverse()];
                    
                        const runAnimation = async (path) => {
                            for (let i = 0; i < path.length - 1; i++) {
                                const current = path[i];
                                const next = path[i + 1];
                    
                                const from = devicePositions[current.id];
                                const to = devicePositions[next.id];
                    
                                if (!from || !to) continue;
                    
                                const [resSuccess, reasons] = next.res;
                    
                                console.log(`Hop ${i + 1}: z ${current.id} do ${next.id} | Dozwolone: ${resSuccess} | Powody: ${reasons.join(", ")}`);
                    
                                await movePacket(from, to, resSuccess, reasons);
                            }
                    
                            setTimeout(() => setPacketAnimation(null), 500);
                        };
                    
                        const movePacket = (from, to, isPermitted, reasons) => {
                            return new Promise((resolve) => {
                                const dx = to.x - from.x;
                                const dy = to.y - from.y;
                                const distance = Math.sqrt(dx * dx + dy * dy);
                                const duration = (distance / 200) * 1000;
                    
                                const startTime = performance.now();
                    
                                const animate = (now) => {
                                    const elapsed = now - startTime;
                                    const progress = Math.min(elapsed / duration, 1);
                    
                                    const x = from.x + dx * progress;
                                    const y = from.y + dy * progress;
                    
                                    setPacketAnimation({
                                        x,
                                        y: y - 10,
                                        icon: isPermitted
                                            ? <MdMarkEmailRead style={{ width: "36px", height: "36px", color: "#13F100" }} />
                                            : <RiMailCloseFill style={{ width: "36px", height: "36px", color: "#FF2D00" }} />,
                                    });
                    
                                    if (progress < 1) {
                                        requestAnimationFrame(animate);
                                    } else {
                                        setTimeout(resolve, 1000); // Zatrzymanie na urządzeniu
                                    }
                                };
                    
                                requestAnimationFrame(animate);
                            });
                        };
                    
                        runAnimation(result[0])
                            .then(() => runAnimation(result[1].slice().reverse()));
                    });
                }
            }
        }
    };

    const handleRunTests = () => {
        if (socket) {
            socket.emit("check_task_completion");
            socket.once("task_completion_status", ({ isCompleted }) => {
                if (isCompleted) {
                    setTaskCompleted(true);
                    toast.success("All tests passed successfully!", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                    setTimeout(() => {
                        handleSubmit();
                    }, 1000);
                } else {
                    setTaskCompleted(false);
                    toast.error("Some tests failed. Please review your configuration.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            });
        }
    };

    const handleShowHints = () => {
        console.log("Current task:", task);
        if (task?.hints && task.hints.length > 0) {
            setShowHints(true);
            setCurrentHint(0);
        } else {
            toast.warning("No hints available for this task.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const handleNextHint = () => {
        if (task && task.hints && currentHint < task.hints.length - 1) {
            setCurrentHint(prev => prev + 1);
        }
    };

    const handlePreviousHint = () => {
        if (currentHint > 0) {
            setCurrentHint(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        if (socket) {
            const studentId = localStorage.getItem("studentId");
            socket.emit("submit_task", { taskId: task.id, studentId });
            socket.once("task_submitted", ({ taskId, success }) => {
                if (success) {
                    toast.success(`Task ${taskId} submitted successfully! (${completedTasks + 1}/${totalTasks} completed)`, {
                        position: "top-right",
                        autoClose: 3000,
                    });
                } else {
                    toast.error("Failed to submit the task. Please try again.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            });
        }
    };

    const getDeviceIcon = (name) => {
        if (name.startsWith("PC")) return <img src={assets.pcIcon} alt="" className="taskDetailsPcIcon" />;
        if (name.startsWith("R")) return <img src={assets.routerIcon} alt="" className="taskDetailsRouterIcon" />;
        if (name.startsWith("S")) return <img src={assets.switchIcon} alt="" className="taskDetailsSwitchIcon" />;
        return "❓"
    };

    const getDeviceTooltip = (device, index) => {
        return (
            <div className="deviceTooltip">
                <p><strong>Device #{index}</strong></p>
                {device.interfaces.map((iface, ifaceIndex) => (
                    <p key={ifaceIndex}>int{ifaceIndex}: {iface || "(no address)"}</p>
                ))}
            </div>
        );
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
            <ToastContainer />
            <div className="taskDetailsContainer">
                <div className="taskDetailsContainerTop">
                    {/* Task Completed Badge */}
                    {taskCompleted && (
                        <div className="taskCompletedBadge">
                            <p>🎉 Task Completed Successfully!</p>
                        </div>
                    )}

                    {/* First Element */}
                    <div className="taskDetailsContainerTopFirst">
                        <div className="taskDetailsContainerTopFirstContainer">
                            {/* Left Part */}
                            <div className="taskDetailsContainerTopFirstContainerLeft">
                                <p className="taskDetailsContainerTopFirstContainerLeftText">
                                    Task #{task?.id}: {task?.title}
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
                                <div className="hintsContainer">
                                        <div 
                                            className="taskDetailsContainerTopFirstContainerRightContainerBtn"
                                            onClick={handleShowHints}
                                        >
                                            <div className="hintsButton">
                                                <FaLightbulb />
                                                <p className="taskDetailsContainerTopFirstContainerRightContainerBtnText">
                                                    Show Hints
                                                </p>
                                            </div>
                                        </div>
                                        {showHints && task?.hints && task.hints.length > 0 && (
                                            <div className="hintsSection">
                                                <div className="hintsHeader">
                                                    <h3>Task Hints</h3>
                                                    <div 
                                                        className="hintsCloseButton"
                                                        onClick={() => setShowHints(false)}
                                                    >
                                                        <FaTimes />
                                                    </div>
                                                </div>
                                                <div className="hintsContent">
                                                    {task.hints.map((hint, index) => (
                                                        <div key={index} className="hintItem">
                                                            <span className="hintNumber">{index + 1}.</span>
                                                            <p>{hint}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
                                            Difficulty: {task?.difficulty}
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
                            {task?.subtasks?.map((subtask) => (
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
                                    onMouseEnter={() => setHoveredDevice({ device, index })}
                                    onMouseLeave={() => setHoveredDevice(null)}
                                    onClick={() => openConsole(index)}
                                >
                                    {getDeviceIcon(device.name)}
                                    <p>{device.name}</p>
                                </div>
                            );
                        })}

                        {/* Render packet animation */}
                        {packetAnimation && (
                            <div
                                style={{
                                    position: "absolute",
                                    left: packetAnimation.x,
                                    top: packetAnimation.y,
                                    width: "36px",
                                    height: "36px",
                                }}
                            >
                                {packetAnimation.icon || (
                                    <IoMdMail
                                        className="packetIcon"
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        {/* Render tooltip */}
                        {hoveredDevice && (
                            <div
                                className="deviceTooltip"
                                style={{
                                    position: "absolute",
                                    left: predefinedPositions[taskId]?.[hoveredDevice.index]?.x + 50 || 0,
                                    top: predefinedPositions[taskId]?.[hoveredDevice.index]?.y || 0,
                                }}
                            >
                                {getDeviceTooltip(hoveredDevice.device, hoveredDevice.index)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Render consoles */}
            {task?.topology?.devices && openConsoles.map((deviceId) => (
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