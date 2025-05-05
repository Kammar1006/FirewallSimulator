import React from 'react';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, taskTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="confirmation-dialog-overlay">
            <div className="confirmation-dialog">
                <h3>Reset Task Completion</h3>
                <p>Are you sure you want to reset the completion status for task "{taskTitle}"?</p>
                <p>This will mark the task as incomplete and you will need to complete it again.</p>
                <div className="confirmation-dialog-buttons">
                    <button className="confirmation-dialog-button cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="confirmation-dialog-button confirm" onClick={onConfirm}>
                        Yes, Reset Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog; 