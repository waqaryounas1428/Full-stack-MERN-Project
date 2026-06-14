import { useNavigate } from "react-router-dom";
import "./footer.css";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    
    // Scroll animations for footer columns
    const { ref: brandRef, isVisible: brandVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: false });
    const { ref: linksRef, isVisible: linksVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: false });
    const { ref: candidatesRef, isVisible: candidatesVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: false });
    const { ref: supportRef, isVisible: supportVisible } = useScrollAnimation({ threshold: 0.2, triggerOnce: false });

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Company Info */}
                <div 
                    className={`footer-column footer-brand scroll-slide-up ${brandVisible ? 'scroll-visible' : ''}`}
                    ref={brandRef}
                >
                    <h3>HireHub.Pk</h3>
                    <p>Connecting talent with opportunity. Your career journey starts here.</p>
                </div>

                {/* Quick Links */}
                <div 
                    className={`footer-column scroll-slide-up scroll-delay-1 ${linksVisible ? 'scroll-visible' : ''}`}
                    ref={linksRef}
                >
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a onClick={() => navigate("/")}>Home</a></li>
                        <li><a onClick={() => navigate("/jobs")}>Browse Jobs</a></li>
                        <li><a onClick={() => navigate("/login")}>Login</a></li>
                        <li><a onClick={() => navigate("/signup")}>Sign Up</a></li>
                    </ul>
                </div>

                {/* For Candidates */}
                <div 
                    className={`footer-column scroll-slide-up scroll-delay-2 ${candidatesVisible ? 'scroll-visible' : ''}`}
                    ref={candidatesRef}
                >
                    <h4>For Candidates</h4>
                    <ul>
                        <li><a onClick={() => navigate("/my-applications")}>My Applications</a></li>
                        <li><a onClick={() => navigate("/career-advice")}>Career Advice</a></li>
                        <li><a onClick={() => navigate("/resume-tips")}>Resume Tips</a></li>
                        <li><a onClick={() => navigate("/job-alerts")}>Job Alerts</a></li>
                    </ul>
                </div>

                {/* Support */}
                <div 
                    className={`footer-column scroll-slide-up scroll-delay-3 ${supportVisible ? 'scroll-visible' : ''}`}
                    ref={supportRef}
                >
                    <h4>Support</h4>
                    <ul>
                        <li><a onClick={() => navigate("/help")}>Help Center</a></li>
                        <li><a onClick={() => navigate("/contact")}>Contact Us</a></li>
                        <li><a onClick={() => navigate("/privacy")}>Privacy Policy</a></li>
                        <li><a onClick={() => navigate("/terms")}>Terms of Service</a></li>
                    </ul>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <p>&copy; {currentYear} Job Portal. All rights reserved.</p>
            </div>
        </footer>
    );
};
