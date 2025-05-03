import React, { useContext, useState, useEffect } from "react";
import { RulesContext } from "../../context/RulesContext";
import { useNavigate } from "react-router-dom";
import TaskCard from "../../components/TaskCard/TaskCard";
import "./tasks.css";

const Tasks = () => {
    const { socket } = useContext(RulesContext);
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [studentProgress, setStudentProgress] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            const studentId = localStorage.getItem("studentId");
            
            // Get student progress
            socket.emit("get_student_progress", { studentId });
            socket.on("student_progress", (data) => {
                if (data && data.progress) {
                    setStudentProgress(data.progress);
                    const completed = data.progress.map((status, index) => (status === 1 ? index + 1 : null)).filter(Boolean);
                    setCompletedTasks(completed);
                    setCompletedCount(completed.length);
                    setTotalTasks(data.progress.length);
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
        }

        return () => {
            if (socket) {
                socket.off("student_progress");
                socket.off("tasks");
            }
        };
    }, [socket, studentProgress]);

    const handleTaskClick = (taskId) => {
        navigate(`/task/${taskId}`);
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
                                    onClick={() => handleTaskClick(task.id)}
                                    completed={studentProgress[task.id - 1] === 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tasks;
