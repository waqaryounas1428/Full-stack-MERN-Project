import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import api from "../../services/api";
import toast from 'react-hot-toast';
import "./myapplications.css";

export const MyApplications = () => {
    const navigate = useNavigate();
    const { socket } = useSocket();

    const [myApps, setMyApps] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyApplications = async () => {
        try {
            const response = await api.get('/applications/my');
            setMyApps(response.data.applications);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadMyApplications = async () => {
            await fetchMyApplications();
        };

        void loadMyApplications();
    }, []);

    // Real-time Socket.io listeners
    useEffect(() => {
        if (!socket) return;

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id;

        // Listen for application status update
        socket.on('application_status_updated', (data) => {
            console.log('📬 Application status changed:', data);
            
            // Only show notification if it's for this user
            if (data.userId !== userId) return;
            
            if (data.status === 'rejected') {
                // Update rejected application in list (keep it visible but marked as rejected)
                setMyApps(prev => prev.map(app => 
                    app._id === data.applicationId ? { ...app, status: 'rejected' } : app
                ));
                
                // Show professional rejection message
                toast.error(
                    <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                        {data.message}
                    </div>,
                    {
                        duration: 10000,
                        icon: '❌',
                        style: {
                            background: '#fff5f5',
                            color: '#c53030',
                            fontWeight: 'normal',
                            fontSize: '14px',
                            padding: '16px',
                            maxWidth: '500px',
                            border: '2px solid #fc8181'
                        }
                    }
                );
            } else if (data.status === 'accepted') {
                // Update accepted application
                setMyApps(prev => prev.map(app => 
                    app._id === data.applicationId ? { ...app, status: 'accepted' } : app
                ));
                
                // Show professional acceptance message
                toast.success(
                    <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                        {data.message}
                    </div>,
                    {
                        duration: 10000,
                        icon: '🎉',
                        style: {
                            background: '#f0fff4',
                            color: '#276749',
                            fontWeight: 'normal',
                            fontSize: '14px',
                            padding: '16px',
                            maxWidth: '500px',
                            border: '2px solid #9ae6b4'
                        }
                    }
                );
            } else if (data.status === 'pending') {
                // Update pending application
                setMyApps(prev => prev.map(app => 
                    app._id === data.applicationId ? { ...app, status: 'pending' } : app
                ));
                toast(data.message, {
                    duration: 4000,
                    icon: '⏳',
                });
            }
        });

        // Listen for application deletion
        socket.on('application_deleted', (data) => {
            console.log('🗑️ Application deleted:', data);
            
            // Only show notification if it's for this user
            if (data.userId !== userId) return;
            
            // Remove deleted application from list
            setMyApps(prev => prev.filter(app => app._id !== data.applicationId));
            
            // Show professional rejection message (same style as rejection)
            toast.error(
                <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {data.message}
                </div>,
                {
                    duration: 10000,
                    icon: '❌',
                    style: {
                        background: '#fff5f5',
                        color: '#c53030',
                        fontWeight: 'normal',
                        fontSize: '14px',
                        padding: '16px',
                        maxWidth: '500px',
                        border: '2px solid #fc8181'
                    }
                }
            );
        });

        return () => {
            socket.off('application_status_updated');
            socket.off('application_deleted');
        };
    }, [socket]);

    if (loading) {
        return (
            <div className="my-apps-page">
                <p style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
                    Loading applications...
                </p>
            </div>
        );
    }

    return (
        <div className="my-apps-page">
            <div className="my-apps-header">
                <h2>My Applications</h2>
                <button className="browse-btn" onClick={() => navigate("/jobs")}>
                    + Browse More Jobs
                </button>
            </div>

            {myApps.length === 0 ? (
                <div className="empty-state">
                    <p>📭 You haven't applied to any jobs yet.</p>
                    <button onClick={() => navigate("/jobs")}>Browse Jobs</button>
                </div>
            ) : (
                <div className="apps-grid">
                    {myApps.map((app) => (
                        <div className="app-card" key={app._id}>
                            <div className="app-card-top">
                                <h3>{app.jobTitle}</h3>
                                <span className={`badge badge-${app.status}`}>{app.status}</span>
                            </div>
                            <p className="app-company">🏢 {app.company}</p>
                            <p className="app-date">
                                📅 {new Date(app.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric", month: "short", day: "numeric"
                                })}
                            </p>
                            {app.resumeName && (
                                <p className="app-resume">📎 {app.resumeName}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
