import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { LogoutModal } from "../LogoutModal/LogoutModal";
import './navbar.css'

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const menuRef = useRef(null);
    
    // Check if we're on home page
    const isHomePage = location.pathname === '/';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setShowLogoutModal(true);
        setShowUserMenu(false);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        logout(); // This will now show toast message
        // Small delay before redirect for better UX
        setTimeout(() => {
            navigate("/");
        }, 500);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <nav className={`navbar ${isHomePage ? 'navbar-transparent' : ''}`}>
            <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                <div className="logo-container">
                    <span className="logo-icon">💼</span>
                    <h1>HireHub.Pk</h1>
                </div>
            </div>

            <div className="auth-buttons">
                <button className="home-btn" onClick={() => {
                    navigate("/");
                    window.scrollTo(0, 0);
                }}>
                    🏠 Home
                </button>
                {user ? (
                    <div className="user-menu-container" ref={menuRef}>
                        <button 
                            className="user-icon-btn"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <span className="user-avatar">👤</span>
                            <span className="user-name-short">{user.name}</span>
                            <span className="dropdown-arrow">{showUserMenu ? '▲' : '▼'}</span>
                        </button>

                        {showUserMenu && (
                            <div className="user-dropdown">
                                <div className="user-info">
                                    <div className="user-avatar-large">👤</div>
                                    <div className="user-details">
                                        <div className="user-name-full">{user.name}</div>
                                        <div className="user-role">{user.role === 'admin' ? 'Administrator' : 'Job Seeker'}</div>
                                    </div>
                                </div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-options">
                                    {user.role === "admin" && (
                                        <button 
                                            className="dropdown-item admin-item"
                                            onClick={() => {
                                                navigate("/admin");
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            ⚙️ Admin Dashboard
                                        </button>
                                    )}
                                    <button 
                                        className="dropdown-item"
                                        onClick={() => {
                                            navigate("/my-applications");
                                            setShowUserMenu(false);
                                        }}
                                    >
                                        📋 My Applications
                                    </button>
                                    <button 
                                        className="dropdown-item"
                                        onClick={() => {
                                            navigate("/jobs");
                                            setShowUserMenu(false);
                                        }}
                                    >
                                        💼 Browse Jobs
                                    </button>
                                    <div className="dropdown-divider"></div>
                                    <button 
                                        className="dropdown-item logout-item"
                                        onClick={handleLogout}
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
                        <button className="signup-btn" onClick={() => navigate("/signup")}>Sign Up</button>
                        
                    </>
                )}
            </div>

            {/* Logout Modal */}
            {showLogoutModal && (
                <LogoutModal
                    userName={user?.name || 'User'}
                    userRole={user?.role || 'user'}
                    onConfirm={confirmLogout}
                    onCancel={cancelLogout}
                />
            )}
        </nav>
    )
}