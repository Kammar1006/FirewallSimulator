import React, { useContext, useState } from 'react';
import "./activityCard.css";
import { RulesContext } from '../../context/RulesContext';

const ActivityCard = ({ title }) => {
    const { challenges, validateChallenge } = useContext(RulesContext);
    const [loading, setLoading] = useState({});
    const [loadingAll, setLoadingAll] = useState(false);

    const handleCheckAll = async () => {
        setLoadingAll(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading
        challenges.forEach((challenge) => validateChallenge(challenge.id));
        setLoadingAll(false);
    };

    return (
        <div className="activityCard">
            <div className="activityCardContainer">
                {/* Title Section */}
                <div className="activityCardContainerTitle">
                    <p className="activityCardContainerTitleText">{title}</p>
                    <button
                        className="activityCardContainerTitleRightBtn"
                        onClick={handleCheckAll}
                        disabled={loadingAll}
                    >
                        {loadingAll ? <div className="activityCardContainerTitleRightBtnSpinner"></div> : <p className="activityCardContainerTitleRightBtnText">Check All</p>}
                    </button>
                </div>

                {/* Challenges Section */}
                <div className="activityCardContainerActivityContainer">
                    {challenges.map((challenge) => (
                        <div
                            key={challenge.id}
                            className={`activityCardContainerActivityContainerContainer ${
                                challenge.isCorrect === true
                                    ? "correct"
                                    : challenge.isCorrect === false
                                    ? "incorrect"
                                    : ""
                            }`}
                        >
                            <p className="activityCardContainerActivityContainerContainerDescriptionText">
                                {challenge.description}
                            </p>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;