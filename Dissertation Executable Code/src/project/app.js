import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { checkUserSession } from "./backend/authentication";
import CredentialsLogin from "./screens/credentialsLogin";
import MFALogin from "./screens/mfaLogin";
import TOTPSetup from "./screens/totpSetup";
import Menu from "./screens/menu";

// Main App handles main routing for the application
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/*" element={<GuestRoute><AuthNavigator /></GuestRoute>} />
        <Route path="/dashboard/*" element={<ProtectedRoute><DashboardNavigator /></ProtectedRoute>} />
        <Route path="/*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  );
};

// Protect Dashboard: Redirects if Not Logged In
const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserSession().then(userSession => {
      if (!userSession) navigate("/auth/login");
      setSession(userSession);
    });
  }, [navigate]);

  if (session === null) return <div>Loading...</div>; 

  return children;
};

// Protect Logins: Redirects if Logged In
const GuestRoute = ({ children }) => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserSession().then((userSession) => {
      setSession(userSession);
      if (userSession) navigate("/dashboard"); 
    });
  }, [navigate]);

  if (session === null) return <div>Loading...</div>;
  return children;
};

const AuthNavigator = () => (
  <Routes>
    <Route path="login" element={<CredentialsLogin />} />
    <Route path="mfa" element={<MFALogin />} />
    <Route path="totp-setup" element={<TOTPSetup />} />
    <Route path="*" element={<Navigate to="login" />} />
  </Routes>
);

const DashboardNavigator = () => (
  <Routes>
    <Route path="/" element={<Menu />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default App;
