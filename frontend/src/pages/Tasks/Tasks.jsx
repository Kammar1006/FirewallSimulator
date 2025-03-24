import React, { useContext, useState } from "react";
import { RulesContext } from "../../context/RulesContext";
import "./tasks.css";

const Tasks = () => {
    const { challenges, validateChallenge } = useContext(RulesContext);
    const [loading, setLoading] = useState({});
    const [loadingAll, setLoadingAll] = useState(false);

    const handleCheck = async (challengeId) => {
        setLoading((prev) => ({ ...prev, [challengeId]: true }));
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
        validateChallenge(challengeId);
        setLoading((prev) => ({ ...prev, [challengeId]: false }));
    };

    const handleCheckAll = async () => {
        setLoadingAll(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
        challenges.forEach((challenge) => validateChallenge(challenge.id));
        setLoadingAll(false);
    };

    return (
        <div className="tasksContainer">

            {/* Top Part */}
            <div className="tasksContainerTop">
                {/* Left Text */}
                <div className="tasksContainerTopLeft">
                    <p className="tasksContainerTopLeftText">
                        Tasks
                    </p>
                </div>

                {/* Right Part */}
                <div className="tasksContainerTopRight">
                    <div className="tasksContainerTopRightContainer">
                        <button
                            className="tasksContainerTopRightContainerBtn"
                            onClick={handleCheckAll}
                            disabled={loadingAll}
                        >
                            {loadingAll ? <div className="spinner"></div> : <p>Check All</p>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Middle Part */}
            <div className="tasksContainerMiddle">
                
                {/* Display Tasks */}
                {
                    challenges.map(challenge => (
                        <div key={challenge.id} className={`tasksContainerMiddleChallengeContainer ${challenge.isCorrect === true ? "correct" : "incorrect"}`}>
                            <div className="tasksContainerMiddleChallengeContainerRule">
                                <p className="tasksContainerMiddleChallengeContainerRuleText">
                                    {challenge.description}
                                </p>
                            </div>
                            <button
                                className="tasksContainerMiddleChallengeContainerBtn"
                                onClick={() => handleCheck(challenge.id)}
                                disabled={loading[challenge.id]}
                            >
                                <p className="tasksContainerMiddleChallengeContainerBtnText">
                                    {loading[challenge.id] ? <div className="spinner"></div> : "Check"}
                                </p>
                            </button>
                        </div>
                    ))
                }

            </div>

        </div>
    );
};

export default Tasks;
