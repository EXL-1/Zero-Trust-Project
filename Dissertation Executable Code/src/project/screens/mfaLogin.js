import React, { useState, useEffect } from "react";
import { globalStyles } from "../styles/globalStyles";
import { verifyMfaCode, verifyTOTPCode } from "../backend/authentication";
import { useNavigate } from "react-router-dom";

// The mfaLogin screen handles the MFA login process
const MFALogin = () => {
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");

  const session = sessionStorage.getItem("session");
  const email = sessionStorage.getItem("email");

  const navigate = useNavigate();

  useEffect(() => {
    const mfaAuthorized = sessionStorage.getItem("session");
    if (!mfaAuthorized) {
      navigate("/auth/login");
    }
  }, [navigate]);

  const handleVerifyMfa = async (e) => {
    e.preventDefault();

    setError("");

    if (!mfaCode) {
      setError("Please enter the MFA code.");
      return;
    }

    try {
      const authResults = await verifyTOTPCode(mfaCode, email, session);

      sessionStorage.removeItem("email");
      sessionStorage.removeItem("session");

      navigate("/dashboard");

      alert("MFA verification successful! You are logged in.");
    } catch (err) {
      setError("MFA verification failed, Please try again.");
    }
  };

  return (
    <div style={globalStyles.container}>
      <h1 style={globalStyles.header}>Zero Trust Project</h1>

      <form onSubmit={handleVerifyMfa} style={globalStyles.form}>
        <input
          style={globalStyles.input}
          type="text"
          placeholder="MFA Code"
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value)}
        />
        {error && <p style={globalStyles.errorText}>{error}</p>}
        <button
          style={{
            ...globalStyles.squareButton,
            ...globalStyles.blueBackground,
          }}
          type="submit"
        >
          <span style={globalStyles.defaultText}>Verify MFA</span>
        </button>
        <button
          style={{
            ...globalStyles.squareButton,
            ...globalStyles.dangerBackground,
          }}
          type="back"
          onClick={() => navigate("/auth/login")}
        >
          <span style={globalStyles.defaultText}>Go Back</span>
        </button>
      </form>
    </div>
  );
};

export default MFALogin;
