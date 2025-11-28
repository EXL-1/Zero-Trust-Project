import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { associateTOTP, verifyTOTP } from "../backend/authentication";
import { QRCodeCanvas } from "qrcode.react";
import { globalStyles } from "../styles/globalStyles";
import { devError, devLog } from "../utils/helperFunctions";

// The totpSetup screen  handles the setup of Time based one Time Password (TOTP) authentication.
// Generates a QR code for the user to scan with an authenticator app.
const TOTPSetup = () => {
  const [totpSecret, setTotpSecret] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSecret = async () => {
      if (!sessionStorage.getItem("session") || totpSecret) {
        return;
      }
      try {
        const response = await associateTOTP(sessionStorage.getItem("session"));
        setTotpSecret(response.secretCode);
        sessionStorage.setItem("session", response.session);
      } catch (err) {
        devError(err);
        setError("Failed to retrive TOTP secret.");
      } finally {
        setLoading(false);
      }
    };

    fetchSecret();
  }, [totpSecret]);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const verifyResponse = await verifyTOTP(
        sessionStorage.getItem("session"),
        mfaCode
      );
      if (verifyResponse.status === "SUCCESS") {
        alert("TOTP successfully enabled!");
        navigate("/auth/login");
      } else {
        alert("Verification failed.");
      }
    } catch (error) {
      const errorMsgProduction = "Failed to verify TOTP code.";
      devError(error);

      setError(errorMsgProduction);
    }
  };

  if (loading)
    return <div style={globalStyles.container}>Loading the TOTP secret...</div>;
  if (!totpSecret)
    return <div style={globalStyles.container}>Failed to get TOTP secret.
    
    <button
          type="back"
          onClick={() => navigate("/auth/login")}
          style={{
            ...globalStyles.squareButton,
            ...globalStyles.dangerBackground,
          }}
        >
          Go Back
        </button></div> ;

  const qrData = `otpauth://totp/ZeroTrustApp?secret=${totpSecret}`;

  return (
    <div style={globalStyles.container}>
      <h2 style={globalStyles.header}>TOTP Setup</h2>
      <form onSubmit={handleVerify} style={globalStyles.form}>
        <p style={{ ...globalStyles.title, textAlign: "center" }}>
          Scan this QR code with an authenticator app:
        </p>
        <div style={{ margin: "10px 0 20px 0" }}>
          <QRCodeCanvas value={qrData} />
        </div>
        <input
          type="text"
          placeholder="Enter MFA Code"
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value)}
          style={globalStyles.input}
        />
        {error && <p style={globalStyles.errorText}>{error}</p>}
        <button
          type="submit"
          style={{
            ...globalStyles.squareButton,
            ...globalStyles.blueBackground,
          }}
        >
          Verify and Enable TOTP
        </button>
      </form>
    </div>
  );
};

export default TOTPSetup;
