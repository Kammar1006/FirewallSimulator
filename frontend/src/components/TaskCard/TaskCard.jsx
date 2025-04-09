import React from "react";
import "./taskCard.css";

const TaskCard = ({ task, onClick, completed }) => {
    return (
        <div
            className={`taskCard ${task.difficulty.toLowerCase()} ${completed ? "completed" : ""}`}
            onClick={onClick}
        >
            <div className="taskCardContainer">
                {/* First Part */}
                <div className="taskCardContainerFirst">
                    <div className="taskCardContainerFirstContainer">
                        <div className="taskCardContainerFirstContainerLeft">
                            <p className="taskCardContainerFirstContainerLeftText">
                                Task #{task.id}
                            </p>
                        </div>
                        <div className="taskCardContainerFirstContainerRight">
                            <div className="taskCardContainerFirstContainerRightDiv">
                                <p className="taskCardContainerFirstContainerRightDivText">
                                    {task.difficulty}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Part */}
                <div className="taskCardContainerSecond">
                    <p className="taskCardContainerSecondText">
                        {task.title}
                    </p>
                </div>

                {/* Third Part */}
                <div className="taskCardContainerThird">
                    <p className="taskCardContainerThirdText">
                        {task.description}
                    </p>
                </div>

                {/* Fourth Part */}
                <div className="taskCardContainerFourth">
                    <button className="taskCardContainerFourthBtn">
                        <p className="taskCardContainerFourthBtnText">
                            Start Task
                        </p>
                    </button>
                </div>

                {completed && <p className="taskCompletedBadge">✅ Completed</p>}
            </div>
        </div>
    );
};

export default TaskCard;
