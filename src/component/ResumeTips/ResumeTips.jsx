import { useNavigate } from "react-router-dom";
import "./ResumeTips.css";

export const ResumeTips = () => {
    const navigate = useNavigate();

    const resumeSections = [
        {
            icon: "📝",
            title: "Resume Structure",
            description: "A well-organized resume makes a strong first impression.",
            tips: [
                "Use a clean, professional layout",
                "Keep it to 1-2 pages maximum",
                "Use consistent formatting and fonts",
                "Include clear section headings"
            ]
        },
        {
            icon: "🎯",
            title: "Professional Summary",
            description: "Start with a compelling summary that highlights your value.",
            tips: [
                "Write 2-3 sentences about your expertise",
                "Highlight your key achievements",
                "Tailor it to the job you're applying for",
                "Use action-oriented language"
            ]
        },
        {
            icon: "💼",
            title: "Work Experience",
            description: "Showcase your professional journey effectively.",
            tips: [
                "List experiences in reverse chronological order",
                "Use bullet points for accomplishments",
                "Quantify achievements with numbers",
                "Focus on relevant experience"
            ]
        },
        {
            icon: "🎓",
            title: "Education & Skills",
            description: "Highlight your qualifications and competencies.",
            tips: [
                "List your highest degree first",
                "Include relevant certifications",
                "Showcase both technical and soft skills",
                "Be honest about your skill levels"
            ]
        },
        {
            icon: "✨",
            title: "Keywords & ATS",
            description: "Optimize your resume for Applicant Tracking Systems.",
            tips: [
                "Use keywords from the job description",
                "Avoid complex formatting that ATS can't read",
                "Use standard section headings",
                "Save as PDF unless specified otherwise"
            ]
        },
        {
            icon: "🔍",
            title: "Proofreading",
            description: "Ensure your resume is error-free and polished.",
            tips: [
                "Check for spelling and grammar errors",
                "Verify contact information is correct",
                "Ask someone else to review it",
                "Read it aloud to catch mistakes"
            ]
        }
    ];

    return (
        <div className="resume-tips-page">
            <div className="tips-header">
                <button className="back-btn" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h1>📄 Resume Tips</h1>
                <p>Create a winning resume that gets you noticed</p>
            </div>

            <div className="tips-grid">
                {resumeSections.map((section, index) => (
                    <div key={index} className="tip-card">
                        <div className="tip-icon">{section.icon}</div>
                        <h2>{section.title}</h2>
                        <p className="tip-description">{section.description}</p>
                        <div className="tip-list">
                            <ul>
                                {section.tips.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className="resume-cta">
                <h2>Ready to apply?</h2>
                <p>Browse our job listings and find your perfect match</p>
                <button className="cta-btn" onClick={() => navigate("/jobs")}>
                    View Jobs →
                </button>
            </div>
        </div>
    );
};
