import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { storage } from "../../utils/storage";
import { validateSignupForm } from "../../utils/validation";
import { handleApiError } from "../../utils/apiHandler";
import { ROUTES, MESSAGES } from "../../utils/constants";
import "./signup.css";

export const Signup = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        emailOrPhone: "",    // ✅ CHANGED: Single field for email OR phone
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const validationErrors = validateSignupForm(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            // Detect if input is email or phone
            const isEmail = form.emailOrPhone.includes('@');
            
            const response = await api.post('/auth/signup', {
                firstName: form.firstName,
                lastName: form.lastName,
                email: isEmail ? form.emailOrPhone : undefined,      // Send email if it's email
                phone: !isEmail ? form.emailOrPhone : undefined,     // Send phone if it's phone
                password: form.password
            });

            const { user, token } = response.data;
            const userData = { ...user, token };

            storage.setUser(userData);
            login(userData);

            setSuccessMsg(MESSAGES.SIGNUP_SUCCESS + " Redirecting...");
            setTimeout(() => navigate(ROUTES.HOME), 2000);
        } catch (error) {
            setLoading(false);
            setErrors({ 
                emailOrPhone: handleApiError(error, 'Signup failed. Please try again.')  // ✅ FIXED
            });
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <h2>Create Account 🚀</h2>
                <p className="signup-sub">Join thousands of job seekers</p>

                {successMsg && <div className="success-msg">{successMsg}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Enter your first name"
                                value={form.firstName}
                                onChange={handleChange}
                            />
                            {errors.firstName && <span className="error">{errors.firstName}</span>}
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Enter your last name"
                                value={form.lastName}
                                onChange={handleChange}
                            />
                            {errors.lastName && <span className="error">{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email or Phone Number</label>
                        <input
                            type="text"
                            name="emailOrPhone"
                            placeholder="Enter email or phone (e.g., user@example.com or 03001234567)"
                            value={form.emailOrPhone}
                            onChange={handleChange}
                        />
                        {errors.emailOrPhone && <span className="error">{errors.emailOrPhone}</span>}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create a password (min 6 chars)"
                                value={form.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <div className="password-field">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                    </div>

                    <button type="submit" className="signup-btn-submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="login-link">
                    Already have an account? <button onClick={() => navigate("/login")}>Login here</button>
                </p>
            </div>
        </div>
    );
};
