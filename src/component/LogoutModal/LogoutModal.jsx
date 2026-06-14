import { useEffect, useState } from "react";
import "./LogoutModal.css";

export const LogoutModal = ({
  userName,
  onConfirm,
  onCancel,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  return (
    <div className="logout-overlay">
      <div className="logout-modal">
        <div className="logout-header">
          <div className="logout-icon">↗</div>
          <h3>Logout</h3>
        </div>

        <p className="logout-text">
          Are you sure you want to logout,
          <span> {userName}</span>?
        </p>

        <div className="logout-actions">
          <button
            className="btn-cancel"
            onClick={onCancel}
            disabled={isLoggingOut}
          >
            Cancel
          </button>

          <button
            className="btn-logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};