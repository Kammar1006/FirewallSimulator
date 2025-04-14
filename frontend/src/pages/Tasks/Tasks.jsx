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
                const taskList = data.titles.map((title, i) => ({
                    id: i + 1,
                    title: title || `Task ${i + 1}`,
                    description: data.desc[i] || `Task ${i + 1}: No description available.`,
                    difficulty: data.difficulty[i] || "Unknown",
                }));
                setTasks(taskList);
                setCompletedTasks(data.completedTasks || []);
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
