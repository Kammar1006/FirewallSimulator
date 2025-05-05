import React, { useContext, useState, useEffect } from "react";
import { RulesContext } from "../../context/RulesContext";
import { useNavigate } from "react-router-dom";
import TaskCard from "../../components/TaskCard/TaskCard";
import ConfirmationDialog from "../../components/ConfirmationDialog/ConfirmationDialog";
import "./tasks.css";

const Tasks = () => {
    const { socket } = useContext(RulesContext);
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [studentProgress, setStudentProgress] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const navigate = useNavigate();

    const updateStudentProgress = (progress) => {
        setStudentProgress(progress);
        const completed = progress.map((status, index) => (status === 1 ? index + 1 : null)).filter(Boolean);
        setCompletedTasks(completed);
        setCompletedCount(completed.length);
        setTotalTasks(progress.length);
    };

    useEffect(() => {
        if (socket) {
            const studentId = localStorage.getItem("studentId");
            
            // Get initial student progress
            socket.emit("get_student_progress", { studentId });
            
            // Listen for student progress updates
            socket.on("student_progress", (data) => {
                if (data && data.progress) {
                    updateStudentProgress(data.progress);
                }
            });

            // Get tasks
            socket.emit("get_tasks");
            socket.on("tasks", (data) => {
                const taskList = data.map((task) => ({
                    id: task.id,
                    title: task.title || `Task ${task.id}`,
                    description: task.desc?.join(" ") || "No description available.",
                    difficulty: task.difficulty || "Unknown",
                    completed: studentProgress[task.id - 1] === 1
                }));
                setTasks(taskList);
            });

            // Listen for task reset confirmation
            socket.on("task_reset_confirmed", (data) => {
                if (data.success) {
                    // Refresh student progress
                    socket.emit("get_student_progress", { studentId });
                }
            });

            // Listen for task completion updates
            socket.on("task_completed", (data) => {
                if (data && data.studentId === studentId) {
                    socket.emit("get_student_progress", { studentId });
                }
            });

            // Listen for student progress updates
            const handleProgressUpdate = (data) => {
                if (data.studentId === studentId) {
                    socket.emit("get_student_progress", { studentId });
                }
            };
            socket.on("student_progress_updated", handleProgressUpdate);

            // Cleanup listeners
            return () => {
                socket.off("student_progress");
                socket.off("tasks");
                socket.off("task_reset_confirmed");
                socket.off("task_completed");
                socket.off("student_progress_updated", handleProgressUpdate);
            };
        }
    }, [socket]);

    useEffect(() => {
        // Update task completion status whenever studentProgress changes
        if (tasks.length > 0 && studentProgress.length > 0) {
            const updatedTasks = tasks.map(task => ({
                ...task,
                completed: studentProgress[task.id - 1] === 1
            }));
            setTasks(updatedTasks);
        }
    }, [studentProgress]);

    useEffect(() => {
        if (socket) {
            const studentId = localStorage.getItem("studentId");
            const interval = setInterval(() => {
                socket.emit("get_student_progress", { studentId });
            }, 10000); // every 10 seconds
            return () => clearInterval(interval);
        }
    }, [socket]);

    const handleTaskClick = (task) => {
        if (studentProgress[task.id - 1] === 1) {
            setSelectedTask(task);
            setShowConfirmation(true);
        } else {
            navigate(`/task/${task.id}`);
        }
    };

    const handleResetConfirm = () => {
        if (selectedTask && socket) {
            const studentId = localStorage.getItem("studentId");
            socket.emit("reset_task", {
                studentId,
                taskId: selectedTask.id
            });
        }
        setShowConfirmation(false);
        setSelectedTask(null);
    };

    const handleResetCancel = () => {
        setShowConfirmation(false);
        setSelectedTask(null);
    };

    return (
        <div className="tasks">
            <div className="tasksContainer">
                {/* Top Part */}
                <div className="tasksContainerTop">
                    <div className="tasksContainerTopContainer">
                        <div className="tasksContainerTopLeft">
                            <p className="tasksContainerTopContainerText">
                                Network Management Tasks
                            </p>
                            <div className="tasksProgressContainer">
                                <div className="tasksProgressBar">
                                    <div 
                                        className="tasksProgressBarFill" 
                                        style={{ width: `${(completedCount / totalTasks) * 100}%` }}
                                    />
                                </div>
                                <p className="tasksProgressText">
                                    {completedCount}/{totalTasks} Tasks Completed
                                </p>
                            </div>
                        </div>
                        <div className="tasksContainerTopRight">
                            <div className="tasksProgressBadge">
                                <span className="tasksProgressBadgeIcon">🏆</span>
                                <span className="tasksProgressBadgeText">
                                    {Math.round((completedCount / totalTasks) * 100)}% Complete
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Part */}
                <div className="tasksContainerMiddle">
                    <div className="tasksContainerMiddleContainer">
                        <p className="tasksContainerMiddleContainerText">
                            Select a task to practice network and firewall management skills
                        </p>
                    </div>
                </div>

                {/* Bottom Part */}
                <div className="tasksContainerBottom">
                    <div className="tasksContainerBottomContainer">
                        <div className="tasksContainerBottomContainerTasksGrid">
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={() => handleTaskClick(task)}
                                    completed={studentProgress[task.id - 1] === 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={showConfirmation}
                onClose={handleResetCancel}
                onConfirm={handleResetConfirm}
                taskTitle={selectedTask?.title}
            />
        </div>
    );
};

export default Tasks;
