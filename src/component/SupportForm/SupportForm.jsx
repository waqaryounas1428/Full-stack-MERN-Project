import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import "./supportform.css";

export const SupportForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!form.phone.trim()) {
            newErrors.phone = "Phone is required";
        } else if (!/^[0-9]{11}$/.test(form.phone)) {
            newErrors.phone = "Phone must be 11 digits";
        }
        if (!form.subject.trim()) newErrors.subject = "Subject is required";
        if (!form.message.trim()) newErrors.message = "Message is required";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fill all required fields correctly');
            return;
        }

        setLoading(true);
        toast.loading('Submitting your request...', { id: 'support-toast' });

        // Simulate API call
        setTimeout(() => {
            toast.success('✅ Support request submitted successfully! We will contact you soon.', { 
                id: 'support-toast', 
                duration: 5000 
            });
            setLoading(false);
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        }, 1500);
    };

    return (
        <div className="support-page">
            <div className="support-container">
                <div className="support-header">
                    <h1>📞 Support Center</h1>
                    <p>Need help? We're here for you! Fill out the form below and our team will get back to you shortly.</p>
                </div>

                {/* Quick Access Cards */}
                <div className="quick-access-cards">
                    <div className="quick-card" onClick={() => navigate("/login")}>
                        <div className="quick-icon">🔐</div>
                        <h3>Login to Account</h3>
                        <p>Access your dashboard and manage applications</p>
                        <button>Login Now →</button>
                    </div>

                    <div className="quick-card" onClick={() => navigate("/jobs")}>
                        <div className="quick-icon">💼</div>
                        <h3>Apply for Jobs</h3>
                        <p>Browse available jobs and submit applications</p>
                        <button>View Jobs →</button>
                    </div>
                </div>

                <div className="support-content">
                    {/* Contact Info */}
                    <div className="contact-info">
                        <h3>📍 Contact Information</h3>
                        
                        <div className="info-item">
                            <div className="info-icon">📧</div>
                            <div>
                                <strong>Email</strong>
                                <p>info@HireHub.Pk</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">📞</div>
                            <div>
                                <strong>Helpline</strong>
                                <p>03338201428</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">⏰</div>
                            <div>
                                <strong>Working Hours</strong>
                                <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                                <p>Sat: 10:00 AM - 4:00 PM</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon">📍</div>
                            <div>
                                <strong>Address</strong>
                                <p>Lahore, Pakistan</p>
                            </div>
                        </div>
                    </div>

                    {/* Support Form */}
                    <div className="support-form-container">
                        <h3>✉️ Send us a Message</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your full name"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <span className="error">{errors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your.email@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <span className="error">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="03001234567"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && <span className="error">{errors.phone}</span>}
                            </div>

                            <div className="form-group">
                                <label>Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="How can we help you?"
                                    value={form.subject}
                                    onChange={handleChange}
                                />
                                {errors.subject && <span className="error">{errors.subject}</span>}
                            </div>

                            <div className="form-group">
                                <label>Message *</label>
                                <textarea
                                    name="message"
                                    rows={6}
                                    placeholder="Describe your issue or question in detail..."
                                    value={form.message}
                                    onChange={handleChange}
                                />
                                {errors.message && <span className="error">{errors.message}</span>}
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
