import { useNavigate } from "react-router-dom";
import "./about.css";
import aboutImg from "../../assets/about.jpg";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export const About = () => {
    const navigate = useNavigate();
    
    // Scroll animations
    const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: false });
    const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: false });

    const handleViewJobs = () => {
        navigate("/jobs");
    };

    return (
        <section className="about-section-wrapper">
            <div className="about-card">
                <div 
                    className={`about-image scroll-slide-left ${imageVisible ? 'scroll-visible' : ''}`}
                    ref={imageRef}
                >
                    <img src={aboutImg} alt="About" />
                </div>

                <div 
                    className={`about-content scroll-slide-right ${contentVisible ? 'scroll-visible' : ''}`}
                    ref={contentRef}
                >
                    <h1>About Us</h1>
                    <p>
                      Welcome to IT Tech, a modern job portal connecting skilled professionals with top employers worldwide. We simplify recruitment through a fast, secure, and user-friendly platform that enables job searching, job posting, candidate applications, and profile management. Our goal is to bridge the gap between talent and opportunity through innovative technology.
                    </p>
                    <button className="view-jobs-btn" onClick={handleViewJobs}>
                        View Jobs →
                    </button>
                </div>
            </div>
        </section>
    );
};