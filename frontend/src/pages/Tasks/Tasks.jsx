import React, { useContext, useState, useEffect } from "react";
import { RulesContext } from "../../context/RulesContext";
import "./tasks.css";

const Tasks = () => {
    const { challenges = [], validateChallenge = () => {}, loading, error } = useContext(RulesContext);
    const [loadingState, setLoadingState] = useState({});
    const [loadingAll, setLoadingAll] = useState(false);

    useEffect(() => {
        console.log("Challenges in Tasks component:", challenges);
    }, [challenges]);

    const handleCheck = async (challengeId) => {
        setLoadingState((prev) => ({ ...prev, [challengeId]: true }));
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
        validateChallenge(challengeId);
        setLoadingState((prev) => ({ ...prev, [challengeId]: false }));
    };

    const handleCheckAll = async () => {
        setLoadingAll(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
        challenges.forEach((challenge) => validateChallenge(challenge.id));
        setLoadingAll(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="tasksContainer">
            {/* Top Part */}
            <div className="tasksContainerTop">
                <div className="tasksContainerTopLeft">
                    <p className="tasksContainerTopLeftText">Tasks</p>
                </div>
                <div className="tasksContainerTopRight">
                    <button
                        className="tasksContainerTopRightContainerBtn"
                        onClick={handleCheckAll}
                        disabled={loadingAll}
                    >
                        {loadingAll ? <div className="spinner"></div> : <p>Check All</p>}
                    </button>
                </div>
            </div>

            {/* Middle Part */}
            <div className="tasksContainerMiddle">
                {challenges.map((challenge) => (
                    <div
                        key={challenge.id}
                        className={`tasksContainerMiddleChallengeContainer ${
                            challenge.isCorrect === true ? "correct" : "incorrect"
                        }`}
                    >
                        <div className="tasksContainerMiddleChallengeContainerRule">
                            <p className="tasksContainerMiddleChallengeContainerRuleText">
                                {challenge.description}
                            </p>
                        </div>
                        <button
                            className="tasksContainerMiddleChallengeContainerBtn"
                            onClick={() => handleCheck(challenge.id)}
                            disabled={loadingState[challenge.id]}
                        >
                            {loadingState[challenge.id] ? (
                                <div className="spinner"></div>
                            ) : (
                                "Check"
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
