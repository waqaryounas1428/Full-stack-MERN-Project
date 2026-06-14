import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ContactUs.css";

export const ContactUs = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for contacting us! We'll get back to you within 24 hours.");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const contactMethods = [
        {
            icon: "📧",
            title: "Email Us",
            details: "info@HireHub.Pk",
            description: "Send us an email anytime"
        },
        {
            icon: "📞",
            title: "Call Us",
            details: "03338201428",
            description: "Mon-Fri from 9am to 6pm"
        },
        {
            icon: "💬",
            title: "Live Chat",
            details: "Available 24/7",
            description: "Get instant help online"
        },
        {
            icon: "📍",
            title: "Visit Us",
            details: "Lahore, Pakistan",
            description: "Our office location"
        }
    ];

    return (
        <div className="contact-page">
            <div className="contact-header">
                <button className="back-btn" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h1>📞 Contact Us</h1>
                <p>We'd love to hear from you. Get in touch with our team!</p>
            </div>

            <div className="contact-content">
                {/* Contact Methods */}
                <div className="contact-methods">
                    {contactMethods.map((method, index) => (
                        <div key={index} className="method-card">
                            <div className="method-icon">{method.icon}</div>
                            <h3>{method.title}</h3>
                            <p className="method-details">{method.details}</p>
                            <p className="method-desc">{method.description}</p>
                        </div>
                    ))}
                </div>

                {/* Contact Form */}
                <div className="contact-form-section">
                    <h2>Send us a Message</h2>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Your Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Your Email *</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Subject *</label>
                            <input
                                type="text"
                                placeholder="What is this regarding?"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Message *</label>
                            <textarea
                                rows="6"
                                placeholder="Tell us more about your inquiry..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-btn">
                            Send Message 📤
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
