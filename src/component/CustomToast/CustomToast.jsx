import './CustomToast.css';

export const CustomToast = ({ message, type = 'info', onClose }) => {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        loading: '⏳'
    };

    const closeToast = () => {
        if (onClose) onClose();
    };

    return (
        <div className={`custom-toast custom-toast-${type}`}>
            <div className="toast-icon">{icons[type]}</div>
            <div className="toast-message">{message}</div>
            <button className="toast-close" onClick={closeToast}>×</button>
        </div>
    );
};
