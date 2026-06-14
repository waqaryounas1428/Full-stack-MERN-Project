import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { LogoutModal } from "../LogoutModal/LogoutModal";
import api from "../../services/api";
import { handleApiError } from "../../utils/apiHandler";
import { validateJobForm } from "../../utils/validation";
import { MESSAGES } from "../../utils/constants";
import "./admin.css";

export const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { socket } = useSocket();

    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    // Dashboard Stats State
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalUsers: 0,
        totalApplications: 0,
        acceptedApps: 0,
        rejectedApps: 0,
        pendingApps: 0,
        acceptanceRate: 0,
        recentJobs: 0,
        recentApplications: 0,
        recentUsers: 0,
        jobsThisMonth: 0,
        applicationsThisMonth: 0,
        jobsByType: [],
        topJobs: [],
        jobsByLocation: []
    });

    // New job form state
    const [newJob, setNewJob] = useState({
        title: "", company: "", location: "", description: "", 
        salary: "", experience: "0-1", type: "full-time", category: "",
        skills: "", requirements: "", benefits: "", deadline: ""
    });

    const [editingJobId, setEditingJobId] = useState(null);

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchJobs = async () => {
            try {
                const response = await api.get('/jobs');
                setJobs(response.data.jobs);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setLoading(false);
            }
        };

        const fetchApplications = async () => {
            if (!user || user.role !== 'admin' || !user.token) return;
            try {
                const response = await api.get('/applications');
                setApplications(response.data.applications);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        const fetchStats = async () => {
            try {
                const response = await api.get('/stats/admin');
                setStats(response.data.stats);
                console.log('📊 Stats loaded:', response.data.stats);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        const loadData = async () => {
            await fetchJobs();
            await fetchApplications();
            await fetchStats();
        };

        void loadData();
    }, [user, navigate]);

    // ===== JOBS MANAGEMENT =====

    const handleAddJob = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateJobForm(newJob);
        if (Object.keys(validationErrors).length > 0) {
            alert("Please fill all required fields!");
            return;
        }

        try {
            const jobData = {
                ...newJob,
                skills: newJob.skills ? newJob.skills.split(',').map(s => s.trim()).filter(s => s) : []
            };
            
            const response = await api.post('/jobs', jobData);
            setJobs([...jobs, response.data.job]);
            resetForm();
            setShowModal(false);
            alert(MESSAGES.JOB_POSTED);
        } catch (error) {
            alert(handleApiError(error, 'Failed to post job'));
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!jobId) {
            console.error('❌ No job ID provided');
            alert('Error: No job ID provided');
            return;
        }
        
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                console.log('🗑️ Deleting job with ID:', jobId);
                const response = await api.delete(`/jobs/${jobId}`);
                console.log('✅ Delete response:', response.data);
                
                setJobs(jobs.filter(j => j._id !== jobId));
                alert(MESSAGES.JOB_DELETED || 'Job deleted successfully!');
            } catch (error) {
                console.error('❌ Delete job error:', error);
                console.error('Error response:', error.response?.data);
                alert(handleApiError(error, 'Failed to delete job'));
            }
        }
    };

    const handleEditJob = (job) => {
        setNewJob({
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            salary: job.salary || "",
            experience: job.experience || "0-1",
            type: job.type || "full-time",
            category: job.category || "",
            skills: job.skills ? job.skills.join(', ') : "",
            requirements: job.requirements || "",
            benefits: job.benefits || "",
            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : "",
        });
        setEditingJobId(job._id);
        setShowModal(true);
    };

    const handleUpdateJob = async (e) => {
        e.preventDefault();
        
        try {
            const jobData = {
                ...newJob,
                skills: newJob.skills ? newJob.skills.split(',').map(s => s.trim()).filter(s => s) : []
            };
            
            const response = await api.put(`/jobs/${editingJobId}`, jobData);
            setJobs(jobs.map(j => j._id === editingJobId ? response.data.job : j));
            resetForm();
            setShowModal(false);
            alert(MESSAGES.JOB_UPDATED);
        } catch (error) {
            alert(handleApiError(error, 'Failed to update job'));
        }
    };

    const resetForm = () => {
        setNewJob({ 
            title: "", company: "", location: "", description: "", 
            salary: "", experience: "0-1", type: "full-time", category: "",
            skills: "", requirements: "", benefits: "", deadline: ""
        });
        setEditingJobId(null);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    // ===== APPLICATIONS MANAGEMENT =====

    const handleDeleteApplication = async (appId) => {
        if (!appId) {
            console.error('❌ No application ID provided');
            alert('Error: No application ID provided');
            return;
        }

        if (window.confirm('Are you sure you want to delete this application? This cannot be undone!')) {
            try {
                console.log('🗑️ Deleting application with ID:', appId);
                const response = await api.delete(`/applications/${appId}`);
                console.log('✅ Delete response:', response.data);
                
                // Remove from state
                setApplications(applications.filter(app => app._id !== appId));
                alert('Application deleted successfully!');
            } catch (error) {
                console.error('❌ Delete application error:', error);
                console.error('Error response:', error.response?.data);
                alert(handleApiError(error, 'Failed to delete application'));
            }
        }
    };

    const handleUpdateApplicationStatus = async (appId, newStatus) => {
        if (!appId) {
            console.error('❌ No application ID provided');
            alert('Error: No application ID provided');
            return;
        }

        try {
            console.log(`📝 Updating application ${appId} status to: ${newStatus}`);
            const response = await api.put(`/applications/${appId}/status`, { status: newStatus });
            console.log('✅ Status update response:', response.data);
            
            const updatedApp = response.data.application;
            
            setApplications(applications.map(app => 
                app._id === appId ? updatedApp : app
            ));

            alert(`Status updated to ${newStatus}!`);
        } catch (error) {
            console.error('❌ Application status update error:', error);
            console.error('Error response:', error.response?.data);
            alert(handleApiError(error, 'Failed to update status'));
        }
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
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

    if (loading) return <div className="admin-dashboard"><p style={{ textAlign: 'center', padding: '50px' }}>Loading...</p></div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-main-container">
                {/* LEFT SIDEBAR */}
                <div className="admin-sidebar">
                    <div className="admin-sidebar-header">
                        <h2>👨‍💼 Admin Dashboard</h2>
                    </div>
                    <div className="sidebar-menu">
                        <button
                            className={`menu-item ${activeMenu === "dashboard" ? "active" : ""}`}
                            onClick={() => setActiveMenu("dashboard")}
                        >
                            📊 Dashboard
                        </button>
                        <button
                            className={`menu-item ${activeMenu === "jobs" ? "active" : ""}`}
                            onClick={() => setActiveMenu("jobs")}
                        >
                            📋 Jobs
                            <span className="badge">{jobs.length}</span>
                        </button>
                        <button
                            className={`menu-item ${activeMenu === "applications" ? "active" : ""}`}
                            onClick={() => setActiveMenu("applications")}
                        >
                            📝 Applications
                            <span className="badge">{applications.length}</span>
                        </button>
                        <button
                            className="menu-item logout-menu-item"
                            onClick={handleLogout}
                        >
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="admin-content">
                    {/* DASHBOARD ANALYTICS */}
                    {activeMenu === "dashboard" && (
                        <div className="dashboard-section">
                            <h2 style={{ marginBottom: '30px', color: '#1f2937', fontSize: '28px' }}>📊 Dashboard Analytics</h2>
                            
                            {/* MAIN STATS GRID */}
                            <div className="stats-grid">
                                <div className="stat-card stat-primary">
                                    <div className="stat-icon">📋</div>
                                    <div className="stat-info">
                                        <h3>{stats.totalJobs}</h3>
                                        <p>Total Jobs</p>
                                        <span className="stat-badge">+{stats.recentJobs} this week</span>
                                    </div>
                                </div>

                                <div className="stat-card stat-success">
                                    <div className="stat-icon">👥</div>
                                    <div className="stat-info">
                                        <h3>{stats.totalUsers}</h3>
                                        <p>Total Users</p>
                                        <span className="stat-badge">+{stats.recentUsers} this week</span>
                                    </div>
                                </div>

                                <div className="stat-card stat-info">
                                    <div className="stat-icon">📝</div>
                                    <div className="stat-info">
                                        <h3>{stats.totalApplications}</h3>
                                        <p>Total Applications</p>
                                        <span className="stat-badge">+{stats.recentApplications} this week</span>
                                    </div>
                                </div>

                                <div className="stat-card stat-accepted">
                                    <div className="stat-icon">✅</div>
                                    <div className="stat-info">
                                        <h3>{stats.acceptedApps}</h3>
                                        <p>Accepted</p>
                                        <span className="stat-badge">{stats.acceptanceRate}% rate</span>
                                    </div>
                                </div>

                                <div className="stat-card stat-pending">
                                    <div className="stat-icon">⏳</div>
                                    <div className="stat-info">
                                        <h3>{stats.pendingApps}</h3>
                                        <p>Pending Review</p>
                                        <span className="stat-badge">Need action</span>
                                    </div>
                                </div>

                                <div className="stat-card stat-rejected">
                                    <div className="stat-icon">❌</div>
                                    <div className="stat-info">
                                        <h3>{stats.rejectedApps}</h3>
                                        <p>Rejected</p>
                                        <span className="stat-badge">Declined</span>
                                    </div>
                                </div>
                            </div>

                            {/* SECONDARY STATS */}
                            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                <div className="stat-card-small">
                                    <h4>📅 Jobs This Month</h4>
                                    <p className="stat-value">{stats.jobsThisMonth}</p>
                                </div>
                                <div className="stat-card-small">
                                    <h4>📝 Apps This Month</h4>
                                    <p className="stat-value">{stats.applicationsThisMonth}</p>
                                </div>
                            </div>

                            {/* TOP JOBS SECTION */}
                            {stats.topJobs && stats.topJobs.length > 0 && (
                                <div style={{ marginTop: '30px' }}>
                                    <h3 style={{ marginBottom: '20px', color: '#374151', fontSize: '20px' }}>🔥 Top 5 Most Applied Jobs</h3>
                                    <div className="top-jobs-list">
                                        {stats.topJobs.map((job, index) => (
                                            <div key={index} className="top-job-item">
                                                <div className="top-job-rank">#{index + 1}</div>
                                                <div className="top-job-info">
                                                    <h4>{job.jobTitle || 'Unknown Job'}</h4>
                                                    <p>🏢 {job.company || 'Unknown Company'}</p>
                                                </div>
                                                <div className="top-job-count">
                                                    <span className="application-count">{job.applicationCount}</span>
                                                    <span className="application-label">applications</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* JOB TYPES DISTRIBUTION */}
                            {stats.jobsByType && stats.jobsByType.length > 0 && (
                                <div style={{ marginTop: '30px' }}>
                                    <h3 style={{ marginBottom: '20px', color: '#374151', fontSize: '20px' }}>💼 Job Type Distribution</h3>
                                    <div className="job-types-grid">
                                        {stats.jobsByType.map((type, index) => (
                                            <div key={index} className="job-type-card">
                                                <div className="job-type-name">{type._id || 'Unknown'}</div>
                                                <div className="job-type-count">{type.count}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* LOCATIONS */}
                            {stats.jobsByLocation && stats.jobsByLocation.length > 0 && (
                                <div style={{ marginTop: '30px' }}>
                                    <h3 style={{ marginBottom: '20px', color: '#374151', fontSize: '20px' }}>📍 Top Job Locations</h3>
                                    <div className="locations-grid">
                                        {stats.jobsByLocation.map((location, index) => (
                                            <div key={index} className="location-card">
                                                <div className="location-name">📍 {location._id}</div>
                                                <div className="location-count">{location.count} jobs</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeMenu === "jobs" && (
                        <div className="jobs-section">
                            <div className="section-header">
                                <h2>All Jobs</h2>
                                <button className="btn-add-new" onClick={() => {
                                    resetForm();
                                    setShowModal(true);
                                }}>
                                    ➕ Add New Job
                                </button>
                            </div>

                            <div className="jobs-grid">
                                {jobs.length === 0 ? (
                                    <p className="empty-msg">No jobs posted yet.</p>
                                ) : (
                                    jobs.map((job) => (
                                        <div className="job-card" key={job._id}>
                                            <div className="job-card-header">
                                                <h3>{job.title}</h3>
                                                <span className="job-type-badge">{job.type}</span>
                                            </div>
                                            <p className="job-company">🏢 {job.company}</p>
                                            <p className="job-location">📍 {job.location}</p>
                                            {job.salary && <p className="job-salary">💰 {job.salary}</p>}
                                            {job.experience && <p className="job-exp">📚 {job.experience} years</p>}
                                            {job.category && <p className="job-cat">🏷️ {job.category}</p>}
                                            {job.skills && job.skills.length > 0 && (
                                                <div className="job-skills">
                                                    {job.skills.slice(0, 3).map((skill, idx) => (
                                                        <span key={idx} className="skill-tag">{skill}</span>
                                                    ))}
                                                    {job.skills.length > 3 && <span className="skill-tag">+{job.skills.length - 3}</span>}
                                                </div>
                                            )}
                                            <div className="job-card-actions">
                                                <button
                                                    className="btn-edit-card"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditJob(job);
                                                    }}
                                                    type="button"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    className="btn-delete-card"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log('Delete button clicked for job:', job._id);
                                                        handleDeleteJob(job._id);
                                                    }}
                                                    type="button"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeMenu === "applications" && (
                        <div className="applications-section">
                            <h2>All Applications</h2>
                            <div className="applications-list">
                                {applications.length === 0 ? (
                                    <p className="empty-msg">No applications yet.</p>
                                ) : (
                                    applications.map((app) => (
                                        <div className="app-item" key={app._id}>
                                            <div className="app-info">
                                                <h3>🏢 {app.jobTitle} - {app.company}</h3>
                                                <div className="app-details">
                                                    <p><strong>👤 Name:</strong> {app.applicantName}</p>
                                                    <p><strong>📧 Email:</strong> {app.email}</p>
                                                    <p><strong>📞 Phone:</strong> {app.phone}</p>
                                                    <p><strong>📅 Applied On:</strong> {new Date(app.createdAt).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}</p>
                                                    <div className="cover-letter-box">
                                                        <strong>📝 Cover Letter:</strong>
                                                        <p>{app.coverLetter}</p>
                                                    </div>
                                                    {app.resumeUrl && (
                                                        <p>
                                                            <strong>📄 Resume:</strong> 
                                                            <a 
                                                                href={app.resumeUrl.includes('cloudinary.com') 
                                                                    ? app.resumeUrl.replace('/upload/', '/upload/fl_attachment/') 
                                                                    : app.resumeUrl}
                                                                download={`resume-${app.applicantName.replace(/\s+/g, '-')}.pdf`}
                                                                className="resume-link"
                                                                style={{ marginLeft: '8px' }}
                                                            >
                                                                ⬇️ Download PDF
                                                            </a>
                                                            <a 
                                                                href={app.resumeUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="resume-link"
                                                                style={{ marginLeft: '8px' }}
                                                            >
                                                                � View URL
                                                            </a>
                                                        </p>
                                                    )}
                                                    {!app.resumeUrl && (
                                                        <p><strong>📄 Resume:</strong> <span style={{ color: '#9ca3af' }}>Not Provided</span></p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="app-status">
                                                <button
                                                    className="btn-reject-quick"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log('Cross button clicked for application:', app._id);
                                                        handleDeleteApplication(app._id);
                                                    }}
                                                    type="button"
                                                    title="Delete this application"
                                                >
                                                    ✕
                                                </button>
                                                <label>Status:</label>
                                                <select
                                                    value={app.status}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        console.log('Status dropdown changed for application:', app._id, 'New status:', e.target.value);
                                                        handleUpdateApplicationStatus(app._id, e.target.value);
                                                    }}
                                                    className={`status-select status-${app.status}`}
                                                >
                                                    <option value="pending">⏳ Pending</option>
                                                    <option value="accepted">✅ Accepted</option>
                                                    <option value="rejected">❌ Rejected</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingJobId ? "Edit Job" : "Add New Job"}</h2>
                            <button className="modal-close" onClick={closeModal}>✕</button>
                        </div>

                        <form onSubmit={editingJobId ? handleUpdateJob : handleAddJob} className="job-form-modal">
                            <div className="form-row">
                                <input type="text" placeholder="Job Title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} required />
                                <input type="text" placeholder="Company" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} required />
                            </div>

                            <div className="form-row">
                                <input type="text" placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} required />
                                <input type="text" placeholder="Salary" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} />
                            </div>

                            <div className="form-row">
                                <select value={newJob.experience} onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })} required>
                                    <option value="0-1">0-1 Years</option>
                                    <option value="1-2">1-2 Years</option>
                                    <option value="2-3">2-3 Years</option>
                                    <option value="3-4">3-4 Years</option>
                                    <option value="4-5">4-5 Years</option>
                                    <option value="5+">5+ Years</option>
                                </select>
                                <select value={newJob.type} onChange={(e) => setNewJob({ ...newJob, type: e.target.value })} required>
                                    <option value="full-time">Full Time</option>
                                    <option value="part-time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <input type="text" placeholder="Category" value={newJob.category} onChange={(e) => setNewJob({ ...newJob, category: e.target.value })} />
                                <input type="date" value={newJob.deadline} onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })} />
                            </div>

                            <input type="text" placeholder="Skills (comma-separated)" value={newJob.skills} onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })} />
                            <textarea placeholder="Description" rows="4" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} />
                            <textarea placeholder="Requirements" rows="3" value={newJob.requirements} onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })} />
                            <textarea placeholder="Benefits" rows="3" value={newJob.benefits} onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })} />

                            <div className="form-actions">
                                <button type="submit" className="btn-primary">{editingJobId ? "Update" : "Post"}</button>
                                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Logout Modal */}
            {showLogoutModal && (
                <LogoutModal
                    userName={user?.name || 'Admin'}
                    userRole={user?.role || 'admin'}
                    onConfirm={confirmLogout}
                    onCancel={cancelLogout}
                />
            )}
        </div>
    );
};
