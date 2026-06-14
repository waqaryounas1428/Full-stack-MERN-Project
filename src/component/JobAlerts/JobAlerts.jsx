import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JobAlerts.css";

export const JobAlerts = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        jobTitle: "",
        location: "",
        frequency: "daily"
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Job alert subscription successful! You will receive notifications at " + formData.email);
        setFormData({
            email: "",
            jobTitle: "",
            location: "",
            frequency: "daily"
        });
    };

    const alertFeatures = [
        {
            icon: "🔔",
            title: "Instant Notifications",
            description: "Get notified immediately when new jobs matching your criteria are posted"
        },
        {
            icon: "🎯",
            title: "Personalized Matches",
            description: "Receive job alerts tailored to your skills, experience, and preferences"
        },
        {
            icon: "⚡",
            title: "Never Miss an Opportunity",
            description: "Stay ahead of the competition with real-time job updates"
        },
        {
            icon: "📧",
            title: "Email & SMS Alerts",
            description: "Choose how you want to receive notifications - email, SMS, or both"
        }
    ];

    return (
        <div className="job-alerts-page">
            <div className="alerts-header">
                <button className="back-btn" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h1>🔔 Job Alerts</h1>
                <p>Stay updated with the latest job opportunities</p>
            </div>

            <div className="alerts-content">
                {/* Left Side - Features */}
                <div className="alerts-features">
                    <h2>Why Subscribe to Job Alerts?</h2>
                    <div className="features-grid">
                        {alertFeatures.map((feature, index) => (
                            <div key={index} className="feature-item">
                                <div className="feature-icon">{feature.icon}</div>
                                <div className="feature-info">
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side - Subscription Form */}
                <div className="alerts-form-container">
                    <h2>Subscribe to Job Alerts</h2>
                    <form className="alerts-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address *</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Job Title / Keywords</label>
                            <input
                                type="text"
                                placeholder="e.g. Software Engineer, Manager"
                                value={formData.jobTitle}
                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Preferred Location</label>
                            <select
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            >
                                <option value="">All Locations</option>
                                <option value="Lahore">Lahore</option>
                                <option value="Karachi">Karachi</option>
                                <option value="Islamabad">Islamabad</option>
                                <option value="Rawalpindi">Rawalpindi</option>
                                <option value="Faisalabad">Faisalabad</option>
                                <option value="Multan">Multan</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Alert Frequency</label>
                            <select
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            >
                                <option value="instant">Instant (as jobs are posted)</option>
                                <option value="daily">Daily Digest</option>
                                <option value="weekly">Weekly Summary</option>
                            </select>
                        </div>

                        <button type="submit" className="submit-btn">
                            🔔 Subscribe to Alerts
                        </button>
                    </form>

                    <p className="form-note">
                        You can unsubscribe at any time. We respect your privacy.
                    </p>
                </div>
            </div>
        </div>
    );
};
