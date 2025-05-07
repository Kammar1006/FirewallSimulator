import React from 'react';
import './CongratulationsDialog.css';

const CongratulationsDialog = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="congratulations-dialog-overlay">
            <div className="congratulations-dialog">
                <div className="congratulations-dialog-content">
                    <h2>Congratulations!</h2>
                    <p>You have successfully completed all tasks!</p>
                    <p>You've mastered the art of network and firewall management.</p>
                    <p className="congratulations-redirect-text">Redirecting to tasks page...</p>
                </div>
            </div>
        </div>
    );
};

export default CongratulationsDialog; 