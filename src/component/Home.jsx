import { useNavigate } from "react-router-dom";
import './home.css';
import { useScrollAnimation } from "../hooks/useScrollAnimation";

export const Home = () => {
    const navigate = useNavigate();
    
    // Scroll animation for hero content
    const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: false });

    const handleViewJobs = () => {
        navigate("/jobs");
    };

    const stats = [
        { icon: "✅", title: "Verified Jobs", label: "All postings are authenticated" },
        { icon: "⚡", title: "Easy Apply", label: "Simple application process" },
        { icon: "👥", number: "10K+", label: "Job Seekers" },
        { icon: "🎯", number: "5K+", label: "Hired" }
    ];

    return (
        <div className="hero">
            <div 
                className={`hero-content scroll-scale ${heroVisible ? 'scroll-visible' : ''}`}
                ref={heroRef}
            >
                <h1>Your Gateway to Career Success</h1>
                <p>Discover thousands of verified government job opportunities across Pakistan. Build your career with transparency, trust, and excellence.</p>
                <button onClick={handleViewJobs}>View Jobs</button>
            </div>

            {/* Stats Cards on Right */}
            <div className="hero-stats">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`stat-card scroll-scale scroll-delay-${index + 1} ${heroVisible ? 'scroll-visible' : ''}`}
                    >
                        <div className="stat-icon">{stat.icon}</div>
                        {stat.title ? (
                            <>
                                <div className="stat-title">{stat.title}</div>
                                <div className="stat-description">{stat.label}</div>
                            </>
                        ) : (
                            <>
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </>
                        )}
                    </div>
                ))}
                
                {/* Help Card Below Stats */}
                <div className={`help-card scroll-scale scroll-delay-5 ${heroVisible ? 'scroll-visible' : ''}`}>
                    <div className="help-title">Need Help?</div>
                    <div className="help-info">
                        <p>📧 Email: info@HireHub.Pk</p>
                        <p>📞 Helpline: 03338201428</p>
                    </div>
                    <button className="help-btn" onClick={() => navigate("/support")}>
                        Open Support Form →
                    </button>
                </div>
            </div>
        </div>
    )
}