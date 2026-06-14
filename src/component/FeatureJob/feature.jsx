import { useNavigate } from "react-router-dom";
import "./feature.css";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export const FeatureJob = () => {
    const navigate = useNavigate();

    const { ref, isVisible } = useScrollAnimation({
        threshold: 0.3,
        triggerOnce: false,
    });

    const handleGetStarted = () => {
        navigate("/jobs");
    };

    return (
        <div className="feature-job">
            <div
                ref={ref}
                className={`journey-card scroll-slide-up ${
                    isVisible ? "scroll-visible" : ""
                }`}
            >
                <h2>Ready to Start Your Journey?</h2>

                <p>
                    Join <strong>1,762,072+</strong> job seekers who found
                    their dream positions through our platform.
                </p>

                <button
                    className="view-all-jobs-btn"
                    onClick={handleGetStarted}
                >
                    Get Started Now
                </button>
            </div>
        </div>
    );
};