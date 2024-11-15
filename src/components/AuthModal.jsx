import React from "react";
import "../styles/modal.css";

const AuthModal = ({ onClose, isOpen, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                {children}
            </div>
        </div>
    );
}

export default AuthModal;