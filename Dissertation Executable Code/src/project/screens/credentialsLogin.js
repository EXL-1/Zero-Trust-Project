import React, { useState } from "react";
import { globalStyles } from "../styles/globalStyles";
import { signIn } from "../backend/authentication";
import { useNavigate } from "react-router-dom";

// The credentialsLogin Screen handles the login process for the email and password.
// Along with input validation and error handling.
const CredentialsLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await signIn(email, password);

      sessionStorage.setItem("email", email);
      sessionStorage.setItem("session", response.session);

      if (process.env.NODE_ENV === "development") {
      console.log("Challenge:", response.challengeName);
      }

      if (response.challengeName === "MFA_SETUP") {
        navigate("/auth/totp-setup");
      } else if (response.challengeName === "NEW_PASSWORD_REQUIRED") {
        alert("Please login again to setup your account.");
        window.location.reload();
      } else {
        navigate("/auth/mfa");
      }
      
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div style={globalStyles.container}>
      <h1 style={globalStyles.header}>Zero Trust Project</h1>
      <form onSubmit={handleSubmit} style={globalStyles.form}>
        <input
          style={globalStyles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={globalStyles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={globalStyles.errorText}>{error}</p>}
        <button
          style={{
            ...globalStyles.squareButton,
            ...globalStyles.blueBackground,
          }}
          type="submit"
        >
          <span style={globalStyles.defaultText}>Login</span>
        </button>
      </form>
    </div>
  );
};

export default CredentialsLogin;
