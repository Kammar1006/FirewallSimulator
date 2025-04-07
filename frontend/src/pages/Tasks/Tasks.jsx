import React, { useContext, useState, useEffect } from "react";
import { RulesContext } from "../../context/RulesContext";
import { useNavigate } from "react-router-dom";
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
                    description: data.desc[i] || `Task ${i + 1}: No description available.`,
                    difficulty: ["Easy", "Medium", "Hard"][i % 3], // Example difficulty rotation
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
        <div className="tasksContainer">
            <h2>Tasks</h2>
            <div className="tasksGrid">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`taskCard ${task.difficulty.toLowerCase()}`}
                        onClick={() => handleTaskClick(task.id)}
                    >
                        <h3>Task {task.id}</h3>
                        <p>{task.description}</p>
                        <p><strong>Difficulty:</strong> {task.difficulty}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
