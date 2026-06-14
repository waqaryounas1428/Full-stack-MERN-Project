import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { Home } from "./component/Home";
import { Navbar } from "./component/nav-bar/navbar";
import { About } from "./component/about/about";
import { FeatureJob } from "./component/FeatureJob/feature";
import { ChooseUs } from "./component/choseUs/chose";
import { Jobs } from "./component/JobsPage/jobs";
import { Login } from "./component/Login/Login";
import { Signup } from "./component/Signup/Signup";
import { ApplyForm } from "./component/ApplyForm/ApplyForm";
import { MyApplications } from "./component/MyApplications/MyApplications";
import { AdminDashboard } from "./component/AdminDashboard/AdminDashboard";
import { SupportForm } from "./component/SupportForm/SupportForm";
import { CareerAdvice } from "./component/CareerAdvice/CareerAdvice";
import { ResumeTips } from "./component/ResumeTips/ResumeTips";
import { JobAlerts } from "./component/JobAlerts/JobAlerts";
import { HelpCenter } from "./component/HelpCenter/HelpCenter";
import { ContactUs } from "./component/ContactUs/ContactUs";
import { PrivacyPolicy } from "./component/PrivacyPolicy/PrivacyPolicy";
import { TermsOfService } from "./component/TermsOfService/TermsOfService";
import { Footer } from "./component/Footer/Footer";
import { Toaster } from 'react-hot-toast';


// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const location = useLocation();
  const showFooter = location.pathname === '/';

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <About />
              <ChooseUs />
              <FeatureJob />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/support" element={<SupportForm />} />
        <Route path="/career-advice" element={<CareerAdvice />} />
        <Route path="/resume-tips" element={<ResumeTips />} />
        <Route path="/job-alerts" element={<JobAlerts />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route
          path="/apply"
          element={
            <ProtectedRoute>
              <ApplyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {showFooter && <Footer />}
      
      {/* Toast Notifications - Center of Screen */}
      <Toaster 
        position="top-center"
        containerStyle={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#fff',
            padding: '14px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            maxWidth: '400px',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;