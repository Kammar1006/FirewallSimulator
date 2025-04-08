import React from "react";
import "./taskCard.css";

const TaskCard = ({ task, onClick }) => {
    return (
        <div
            className={`taskCard ${task.difficulty.toLowerCase()}`}
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
                    <h4 className="taskCardContainerSecondTitle">{task.title}</h4> {/* Display the title */}
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
