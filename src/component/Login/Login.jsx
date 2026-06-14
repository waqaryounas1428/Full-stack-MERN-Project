import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { storage } from "../../utils/storage";
import { validateLoginForm } from "../../utils/validation";
import { handleApiError } from "../../utils/apiHandler";
import { ADMIN_CREDENTIALS, ROUTES } from "../../utils/constants";
import "./login.css";

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ emailOrPhone: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const validationErrors = validateLoginForm(form.emailOrPhone, form.password);  // ✅ CHANGED
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        // Hardcoded admin credentials
        if (form.emailOrPhone === ADMIN_CREDENTIALS.EMAIL && form.password === ADMIN_CREDENTIALS.PASSWORD) {  // ✅ CHANGED
            const adminUser = {
                _id: "admin",
                name: "Admin User",
                email: ADMIN_CREDENTIALS.EMAIL,
                role: "admin",
                token: ADMIN_CREDENTIALS.TOKEN
            };
            
            storage.setUser(adminUser);
            login(adminUser);
            navigate(ROUTES.JOBS);
            return;
        }

        try {
            const response = await api.post('/auth/login', {
                emailOrPhone: form.emailOrPhone,  // ✅ CHANGED: Send emailOrPhone
                password: form.password
            });

            const { user, token } = response.data;
            const userData = { ...user, token };
            
            storage.setUser(userData);
            login(userData);

            if (user.role === 'admin') {
                navigate(ROUTES.JOBS);
            } else {
                navigate(ROUTES.HOME);
            }
        } catch (error) {
            setLoading(false);
            setErrors({ 
                emailOrPhone: handleApiError(error, 'Login failed. Please try again.')  // ✅ CHANGED
            });
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Welcome Back 👋</h2>
                <p className="login-sub">Login to apply for jobs</p>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label>Email or Phone Number</label>
                        <input
                            type="text"
                            name="emailOrPhone"
                            placeholder="Enter email or phone number"
                            value={form.emailOrPhone}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.emailOrPhone && <span className="error">{errors.emailOrPhone}</span>}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-field">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                disabled={loading}
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

                    <button type="submit" className="login-btn-submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="signup-link">
                    Don't have an account? <button onClick={() => navigate("/signup")}>Sign up here</button>
                </p>
            </div>
        </div>
    );
};
