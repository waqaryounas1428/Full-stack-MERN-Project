import { useNavigate } from "react-router-dom";
import "./TermsOfService.css";

export const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="terms-page">
            <div className="terms-header">
                <button className="back-btn" onClick={() => navigate("/")}>
                    ← Back to Home
                </button>
                <h1>📜 Terms of Service</h1>
                <p className="last-updated">Last Updated: January 2025</p>
            </div>

            <div className="terms-content">
                <section className="terms-section">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using HireHub.Pk, you accept and agree to be bound by the terms and provision 
                        of this agreement. If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>2. User Registration</h2>
                    <p>To access certain features, you must register for an account. You agree to:</p>
                    <ul>
                        <li>Provide accurate, current, and complete information</li>
                        <li>Maintain and promptly update your account information</li>
                        <li>Maintain the security of your password</li>
                        <li>Accept all responsibility for all activities under your account</li>
                        <li>Notify us immediately of any unauthorized use</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>3. User Conduct</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Post false, inaccurate, misleading, or fraudulent information</li>
                        <li>Use the service for any illegal purpose</li>
                        <li>Harass, abuse, or harm another person</li>
                        <li>Violate any intellectual property rights</li>
                        <li>Upload viruses or malicious code</li>
                        <li>Spam or send unsolicited messages</li>
                        <li>Interfere with or disrupt the service</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>4. Job Postings and Applications</h2>
                    <p><strong>For Employers:</strong></p>
                    <ul>
                        <li>You are responsible for the accuracy of job postings</li>
                        <li>Job postings must comply with all applicable laws</li>
                        <li>You must not discriminate based on protected characteristics</li>
                        <li>You agree to handle applicant data responsibly</li>
                    </ul>
                    <p><strong>For Job Seekers:</strong></p>
                    <ul>
                        <li>You are responsible for the accuracy of your profile and resume</li>
                        <li>You grant employers permission to review your application materials</li>
                        <li>You understand that we do not guarantee employment</li>
                    </ul>
                </section>

                <section className="terms-section">
                    <h2>5. Intellectual Property</h2>
                    <p>
                        All content on HireHub.Pk, including text, graphics, logos, and software, is the property of 
                        HireHub.Pk or its content suppliers and is protected by intellectual property laws. You may 
                        not reproduce, distribute, or create derivative works without express written permission.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>6. Disclaimer of Warranties</h2>
                    <p>
                        HireHub.Pk is provided "as is" without any warranties, expressed or implied. We do not warrant 
                        that the service will be uninterrupted, secure, or error-free. We do not guarantee the accuracy 
                        or reliability of any information obtained through the service.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>7. Limitation of Liability</h2>
                    <p>
                        HireHub.Pk shall not be liable for any indirect, incidental, special, consequential, or punitive 
                        damages resulting from your use of or inability to use the service. Our total liability shall not 
                        exceed the amount you paid us in the past twelve months.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>8. Termination</h2>
                    <p>
                        We reserve the right to terminate or suspend your account and access to the service at our sole 
                        discretion, without notice, for conduct that we believe violates these terms or is harmful to 
                        other users, us, or third parties, or for any other reason.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>9. Modifications to Service</h2>
                    <p>
                        We reserve the right to modify or discontinue, temporarily or permanently, the service (or any 
                        part thereof) with or without notice. We shall not be liable to you or any third party for any 
                        modification, suspension, or discontinuance of the service.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>10. Governing Law</h2>
                    <p>
                        These terms shall be governed by and construed in accordance with the laws of Pakistan, without 
                        regard to its conflict of law provisions. Any disputes shall be subject to the exclusive 
                        jurisdiction of the courts in Pakistan.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>11. Changes to Terms</h2>
                    <p>
                        We reserve the right to update these terms at any time. We will notify you of any changes by 
                        posting the new terms on this page and updating the "Last Updated" date. Your continued use of 
                        the service after any changes constitutes acceptance of the new terms.
                    </p>
                </section>

                <section className="terms-section">
                    <h2>12. Contact Information</h2>
                    <p>
                        If you have any questions about these Terms of Service, please contact us:
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
