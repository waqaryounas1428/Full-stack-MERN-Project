import { useNavigate } from "react-router-dom";
import "./CareerAdvice.css";

export const CareerAdvice = () => {
    const navigate = useNavigate();

    const adviceArticles = [
        {
            icon: "🎯",
            title: "How to Find Your Dream Job",
            description: "Learn strategies to identify and pursue career opportunities that align with your passion and skills.",
            tips: [
                "Research companies that match your values",
                "Network with professionals in your field",
                "Tailor your applications to each position",
                "Stay persistent and patient in your search"
            ]
        },
        {
            icon: "💼",
            title: "Preparing for Job Interviews",
            description: "Master the art of interviewing with these proven techniques and best practices.",
            tips: [
                "Research the company and role thoroughly",
                "Practice common interview questions",
                "Prepare thoughtful questions for the interviewer",
                "Follow up with a thank-you email"
            ]
        },
        {
            icon: "📈",
            title: "Building a Strong Career Path",
            description: "Plan your career progression and develop skills that will help you grow professionally.",
            tips: [
                "Set clear short-term and long-term goals",
                "Seek mentorship and guidance",
                "Continuously learn and update your skills",
                "Take on challenging projects"
            ]
        },
        {
            icon: "🤝",
            title: "Networking for Success",
            description: "Build meaningful professional relationships that can open doors to new opportunities.",
            tips: [
                "Attend industry events and conferences",
                "Join professional associations",
                "Use LinkedIn effectively",
                "Maintain relationships with former colleagues"
            ]
        }
    ];

    return (
        <div className="career-advice-page">
            <div className="advice-header">
                <button className="back-btn" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h1>💡 Career Advice</h1>
                <p>Expert guidance to help you navigate your career journey</p>
            </div>

            <div className="advice-grid">
                {adviceArticles.map((article, index) => (
                    <div key={index} className="advice-card">
                        <div className="advice-icon">{article.icon}</div>
                        <h2>{article.title}</h2>
                        <p className="advice-description">{article.description}</p>
                        <div className="advice-tips">
                            <h3>Key Points:</h3>
                            <ul>
                                {article.tips.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
