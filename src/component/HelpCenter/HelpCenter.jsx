import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HelpCenter.css";

export const HelpCenter = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const faqCategories = [
        { id: "all", name: "All Topics", icon: "📚" },
        { id: "jobs", name: "Jobs & Applications", icon: "💼" },
        { id: "account", name: "Account & Profile", icon: "👤" },
        { id: "technical", name: "Technical Support", icon: "🔧" }
    ];

    const faqs = [
        {
            category: "jobs",
            question: "How do I search for jobs?",
            answer: "Go to the 'Browse Jobs' page from the navigation menu. You can filter jobs by location, job type, experience level, and use the search bar to find specific positions."
        },
        {
            category: "jobs",
            question: "How do I apply for a job?",
            answer: "Click on any job listing to view details, then click the 'Apply Now' button. You'll need to be logged in to submit an application. Fill out the application form with your details and cover letter."
        },
        {
            category: "jobs",
            question: "Can I track my applications?",
            answer: "Yes! Go to 'My Applications' in your account menu to see all jobs you've applied for and their current status (pending, accepted, or rejected)."
        },
        {
            category: "account",
            question: "How do I create an account?",
            answer: "Click on 'Sign Up' in the top navigation. Fill in your name, email, password, and select whether you're a job seeker or employer. Verify your email to activate your account."
        },
        {
            category: "account",
            question: "I forgot my password. What should I do?",
            answer: "Click 'Login' then 'Forgot Password'. Enter your registered email address and we'll send you a password reset link."
        },
        {
            category: "account",
            question: "How do I update my profile?",
            answer: "Log in to your account and click on your profile icon. Select 'Edit Profile' to update your personal information, contact details, and preferences."
        },
        {
            category: "technical",
            question: "The website is loading slowly. What can I do?",
            answer: "Try clearing your browser cache and cookies. Ensure you have a stable internet connection. If the issue persists, try using a different browser or contact our support team."
        },
        {
            category: "technical",
            question: "I'm not receiving email notifications",
            answer: "Check your spam/junk folder. Add our email address to your contacts. Verify your email settings in your profile to ensure notifications are enabled."
        },
        {
            category: "jobs",
            question: "How can I set up job alerts?",
            answer: "Visit the 'Job Alerts' page from the footer menu. Enter your email, preferred job titles, location, and frequency. You'll receive notifications when matching jobs are posted."
        },
        {
            category: "account",
            question: "Can I delete my account?",
            answer: "Yes, you can request account deletion by contacting our support team through the 'Contact Us' page. Please note this action is permanent and cannot be undone."
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="help-center-page">
            <div className="help-header">
                <button className="back-btn" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h1>❓ Help Center</h1>
                <p>Find answers to your questions</p>

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Search for help..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="help-content">
                <div className="category-sidebar">
                    <h3>Categories</h3>
                    {faqCategories.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <span className="cat-icon">{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="faq-list">
                    <h2>Frequently Asked Questions</h2>
                    {filteredFaqs.length === 0 ? (
                        <p className="no-results">No results found. Try a different search term.</p>
                    ) : (
                        filteredFaqs.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <h3>{faq.question}</h3>
                                <p>{faq.answer}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="help-cta">
                <h2>Still need help?</h2>
                <p>Our support team is here to assist you</p>
                <button className="contact-btn" onClick={() => navigate("/contact")}>
                    Contact Support →
                </button>
            </div>
        </div>
    );
};
