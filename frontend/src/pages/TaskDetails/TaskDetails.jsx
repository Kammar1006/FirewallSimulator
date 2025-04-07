import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { RulesContext } from "../../context/RulesContext";

const TaskDetails = () => {
    const { taskId } = useParams();
    const { socket, getRules } = useContext(RulesContext);
    const [task, setTask] = useState(null);

    useEffect(() => {
        if (socket) {
            socket.emit("get_tasks");
            socket.on("tasks", (data) => {
                setTask({
                    id: taskId,
                    description: data.desc[taskId - 1] || "No description available.",
                    difficulty: ["Easy", "Medium", "Hard"][(taskId - 1) % 3],
                    subtasks: data.subtasks || [],
                });
            });
        }

        return () => {
            if (socket) {
                socket.off("tasks");
            }
        };
    }, [socket, taskId]);

    useEffect(() => {
        if (taskId) {
            getRules(taskId, 0, "input"); // Example: Fetch rules for the task
        }
    }, [taskId, getRules]);

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
                    {/* Add rule configuration UI here */}
                </>
            ) : (
                <p>Loading task details...</p>
            )}
        </div>
    );
};

export default TaskDetails;
