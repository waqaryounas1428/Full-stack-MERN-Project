import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { validateApplicationForm } from "../../utils/validation";
import { handleApiError } from "../../utils/apiHandler";
import { ROUTES, MESSAGES } from "../../utils/constants";
import toast from 'react-hot-toast';
import "./applyform.css";

export const ApplyForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // job passed via navigate state
    const job = location.state?.job;

    const [form, setForm] = useState({
        fullName: user?.name || "",
        email: user?.email || "",
        phone: "",
        resume: null,
        coverLetter: "",
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const validationErrors = validateApplicationForm(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fill all required fields correctly');
            return;
        }

        setLoading(true);
        toast.loading('Submitting your application...', { id: 'submit-toast' });

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('jobId', job._id || job.id);
            formData.append('applicantName', form.fullName);
            formData.append('email', form.email);
            formData.append('phone', form.phone);
            formData.append('coverLetter', form.coverLetter);
            
            // Add resume file if selected
            if (form.resume) {
                formData.append('resume', form.resume);
            }

            await api.post('/applications', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('🎉 Application Submitted Successfully!', { id: 'submit-toast', duration: 4000 });
            setSubmitted(true);
            setTimeout(() => navigate(ROUTES.MY_APPLICATIONS), 2000);
        } catch (error) {
            setLoading(false);
            const errorMsg = handleApiError(error, 'Failed to submit application');
            
            if (errorMsg.includes('Already applied')) {
                toast.error(`❌ ${MESSAGES.ALREADY_APPLIED}`, { id: 'submit-toast', duration: 4000 });
            } else {
                toast.error(`❌ ${errorMsg}`, { id: 'submit-toast', duration: 4000 });
            }
        }
    };

    if (!job) {
        return (
            <div className="apply-page">
                <div className="apply-card">
                    <p>No job selected. <button onClick={() => navigate("/jobs")}>Go to Jobs</button></p>
                </div>
            </div>
        );
    }

    return (
        <div className="apply-page">
            <div className="apply-card">

                {/* Success message */}
                {submitted ? (
                    <div className="success-box">
                        <div className="success-icon">✅</div>
                        <h3>Application Submitted Successfully!</h3>
                        <p>Redirecting to My Applications...</p>
                    </div>
                ) : (
                    <>
                        {/* Job Summary */}
                        <div className="job-summary">
                            <h2>Apply for: <span>{job.title}</span></h2>
                            <p>🏢 {job.company} &nbsp;|&nbsp; 📍 {job.location} &nbsp;|&nbsp; 🧠 {job.exp}</p>
                        </div>

                        <form onSubmit={handleSubmit} noValidate>

                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Your full name"
                                    value={form.fullName}
                                    onChange={handleChange}
                                />
                                {errors.fullName && <span className="error">{errors.fullName}</span>}
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your email"
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
                                    placeholder="e.g. 03001234567"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && <span className="error">{errors.phone}</span>}
                            </div>

                            <div className="form-group">
                                <label>Resume (optional)</label>
                                <input
                                    type="file"
                                    name="resume"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Cover Letter / Message *</label>
                                <textarea
                                    name="coverLetter"
                                    rows={5}
                                    placeholder="Why are you a good fit for this role?"
                                    value={form.coverLetter}
                                    onChange={handleChange}
                                />
                                {errors.coverLetter && <span className="error">{errors.coverLetter}</span>}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="back-btn" onClick={() => navigate("/jobs")}>
                                    ← Back to Jobs
                                </button>
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>

                        </form>
                    </>
                )}
            </div>
        </div>
    );
};
