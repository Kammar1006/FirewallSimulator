import React, { useContext, useState, useEffect } from "react";
import { RulesContext } from "../../context/RulesContext";
import { useNavigate } from "react-router-dom";
import TaskCard from "../../components/TaskCard/TaskCard";
import "./tasks.css";

const Tasks = () => {
    const { socket } = useContext(RulesContext);
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            socket.emit("get_tasks");
            socket.on("tasks", (data) => {
                const taskList = data.map((task) => ({
                    id: task.id,
                    title: task.title || `Task ${task.id}`,
                    description: task.desc.join(" ") || "No description available.",
                    difficulty: task.difficulty || "Unknown",
                }));
                setTasks(taskList);
                setCompletedTasks(data.filter((task) => task.completed).map((task) => task.id)); // Handle completed tasks if provided
            });
        }

        return () => {
            if (socket) {
                socket.off("tasks");
            }
        };
    }, [socket]);

    const handleTaskClick = (taskId) => {
        navigate(`/task/${taskId}`);
    };

    return (
        <div className="tasks">
            <div className="tasksContainer">
                {/* Top Part */}
                <div className="tasksContainerTop">
                    <div className="tasksContainerTopContainer">
                        <p className="tasksContainerTopContainerText">
                            Network Management Tasks
                        </p>
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
                                    completed={completedTasks.includes(task.id)}
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
