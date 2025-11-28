import React, { useState } from "react";
import { globalStyles } from "../styles/globalStyles";
import {
  signOut,
} from "../backend/authentication";
import { useNavigate } from "react-router-dom";

// The menu screen notifies the user that they are signed in and provides a sign out option.
const Menu = () => {
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();

    setError("");

    try {
      signOut();

      navigate("/");

      alert("You have been signed out.");
    } catch (err) {
      setError("Sign out failed. Please try again.");
    }
  };

  return (
    <div style={globalStyles.container}>
      <h1 style={globalStyles.header}>Zero Trust Project</h1>
      <form style={globalStyles.form}>
        <p style={globalStyles.title}>You are signed in!</p>
        <button
          onClick={handleSignOut}
          style={{
            ...globalStyles.squareButton,
            ...globalStyles.dangerBackground,
          }}
        >
          Sign Out
        </button>
        {error && <p style={globalStyles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Menu;
