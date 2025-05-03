import React from "react";
import "./taskCard.css";

const TaskCard = ({ task, onClick, completed }) => {
    return (
        <div
            className={`taskCard ${completed ? "completed" : ""}`}
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
                                {!completed && (
                                    <p className="taskCardContainerFirstContainerRightDivText">
                                        {task.difficulty}
                                    </p>
                                )}
                                {completed && (
                                    <div className="taskCompletedInlineLabel">
                                        <p className="taskCompletedInlineLabelText">
                                            ✔ Completed
                                        </p>
                                    </div>
                                )}
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
            </div>
        </div>
    );
};

export default TaskCard;
