import React, { useContext, useState, useEffect } from "react";
import { RulesContext } from "../../context/RulesContext";
import { useNavigate } from "react-router-dom";
import TaskCard from "../../components/TaskCard/TaskCard";
import "./tasks.css";

const Tasks = () => {
    const { socket } = useContext(RulesContext);
    const [tasks, setTasks] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            socket.emit("get_tasks");
            socket.on("tasks", (data) => {
                const taskList = Array.from({ length: 6 }, (_, i) => ({
                    id: i + 1,
                    title: data.titles[i] || `Task ${i + 1}`,
                    description: data.desc[i] || `Task ${i + 1}: No description available.`,
                    difficulty: ["Easy", "Medium", "Hard"][i % 3],
                }));
                setTasks(taskList);
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
                    <p className="tasksContainerMiddleContainer">
                        <p className="tasksContainerMiddleContainerText">
                            Select a task to practice network and firewall management skills
                        </p>
                    </p>
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
