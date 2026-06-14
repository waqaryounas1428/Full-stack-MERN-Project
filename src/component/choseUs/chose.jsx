import "./chose.css";
import Img from "../../assets/why-choose-us.jpg";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export const ChooseUs = () => {
    // Scroll animations
    const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: false });
    const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.3, triggerOnce: false });

    return (
        <section className="choose-us-section">
            <div className="choose-us-card">
                <div 
                    className={`about-image scroll-slide-right ${imageVisible ? 'scroll-visible' : ''}`}
                    ref={imageRef}
                >
                    <img src={Img} alt="Why Choose Us" />
                </div>

                <div 
                    className={`about-content scroll-slide-left ${contentVisible ? 'scroll-visible' : ''}`}
                    ref={contentRef}
                >
                    <h1>Why Choose Us?</h1>
                    <p>Our platform connects talented professionals with top employers through a simple, fast, and reliable hiring process. Whether you're a fresh graduate or an experienced professional, we help you discover opportunities that match your skills and career goals. With an easy application process, real-time job listings, and a user-friendly experience, we make job searching more efficient and successful.</p>
                </div>
            </div>
        </section>
    );
};