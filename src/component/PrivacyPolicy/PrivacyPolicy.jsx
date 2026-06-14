import { useNavigate } from "react-router-dom";
import "./PrivacyPolicy.css";

export const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="privacy-page">
            <div className="privacy-header">
                <button className="back-btn" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h1>🔒 Privacy Policy</h1>
                <p className="last-updated">Last Updated: January 2025</p>
            </div>

            <div className="privacy-content">
                <section className="policy-section">
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to HireHub.Pk. We respect your privacy and are committed to protecting your personal data. 
                        This privacy policy will inform you about how we look after your personal data when you visit our 
                        website and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>2. Information We Collect</h2>
                    <p>We may collect, use, store and transfer different kinds of personal data about you:</p>
                    <ul>
                        <li><strong>Identity Data:</strong> First name, last name, username</li>
                        <li><strong>Contact Data:</strong> Email address, telephone numbers</li>
                        <li><strong>Profile Data:</strong> Your resume, work experience, skills, and qualifications</li>
                        <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                        <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>3. How We Use Your Information</h2>
                    <p>We use your personal data for the following purposes:</p>
                    <ul>
                        <li>To register you as a new user and manage your account</li>
                        <li>To process and manage job applications</li>
                        <li>To send you job alerts and notifications</li>
                        <li>To improve our website and services</li>
                        <li>To communicate with you about your applications</li>
                        <li>To comply with legal obligations</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>4. Data Security</h2>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being 
                        accidentally lost, used or accessed in an unauthorized way. We limit access to your personal 
                        data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>5. Data Retention</h2>
                    <p>
                        We will only retain your personal data for as long as necessary to fulfil the purposes we 
                        collected it for, including for the purposes of satisfying any legal, accounting, or reporting 
                        requirements. When your data is no longer required, we will securely delete it.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>6. Your Legal Rights</h2>
                    <p>Under data protection laws, you have the right to:</p>
                    <ul>
                        <li>Request access to your personal data</li>
                        <li>Request correction of your personal data</li>
                        <li>Request erasure of your personal data</li>
                        <li>Object to processing of your personal data</li>
                        <li>Request restriction of processing your personal data</li>
                        <li>Request transfer of your personal data</li>
                        <li>Withdraw consent</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>7. Cookies</h2>
                    <p>
                        We use cookies and similar tracking technologies to track activity on our website and store 
                        certain information. You can instruct your browser to refuse all cookies or to indicate when 
                        a cookie is being sent.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>8. Third-Party Links</h2>
                    <p>
                        Our website may include links to third-party websites. We do not control these websites and 
                        are not responsible for their privacy statements. We encourage you to read the privacy policy 
                        of every website you visit.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>9. Changes to Privacy Policy</h2>
                    <p>
                        We may update our privacy policy from time to time. We will notify you of any changes by 
                        posting the new privacy policy on this page and updating the "Last Updated" date.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>10. Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy or our privacy practices, please contact us:
                    </p>
                    <div className="contact-info">
                        <p>📧 Email: info@HireHub.Pk</p>
                        <p>📞 Phone: 03338201428</p>
                    </div>
                </section>
            </div>
        </div>
    );
};
