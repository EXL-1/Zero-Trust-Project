import AWS from "aws-sdk";
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserSession,
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";
import { devError, devLog } from "../utils/helperFunctions";

// The authentication backend file handles the authentication process using AWS Cognito.
AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
});

const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
};

export const userPool = new CognitoUserPool(poolData);
export const cognito = new AWS.CognitoIdentityServiceProvider();

// This function checks if a user session exists
export const checkUserSession = async () => {
  const cognitoUser = userPool.getCurrentUser();

  if (!cognitoUser) {
    if (process.env.NODE_ENV === "development") {
      console.log("No user is currently logged in.");
    } 
    return; // No user session exists
  }

  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err, session) => {
      if (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error retrieving session:", err);
        }
        resolve(false);
      } else if (session.isValid()) {
        if (process.env.NODE_ENV === "development") {
          console.log("User is logged in. Session:", session);
        }
        resolve(true);
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log("Session is invalid or expired.");
        }
        resolve(false);
      }
    });
  });
};

// This function signs in the user using their email and password
export const signIn = async (email, password) => {
  const authenticationParams = {
    AuthFlow: process.env.REACT_APP_AUTH_FLOW,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  try {
    const response = await cognito.initiateAuth(authenticationParams).promise();

    if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
      confirmPassword(email, password, response.Session);
    }
    
    return {
      session: response.Session,
      challengeName: response.ChallengeName,
    };

  } catch (error) {
    const errorMsgProduction = "Login failed. Please try again.";
    if (process.env.NODE_ENV === "development") {
      console.error("Error signing in:", error);
    }
    throw new Error(errorMsgProduction);
  }
};

// This function verifies the Email MFA code entered by the user
export const verifyMfaCode = async (mfaCode, username, session) => {
  const mfaParameters = {
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
    ChallengeName: "EMAIL_OTP",
    Session: session,
    ChallengeResponses: {
      USERNAME: username,
      EMAIL_OTP_CODE: mfaCode,
    },
  };

  try {
    const response = await cognito
      .respondToAuthChallenge(mfaParameters)
      .promise();

    setCustomSession(username, response.AuthenticationResult);
    return response.AuthenticationResult;
  } catch (error) {
    const errorMsgProduction = "MFA verification failed. Please try again.";
    if (process.env.NODE_ENV === "development") {
      console.error("Error verifying MFA code:", error);
    }
    throw new Error(errorMsgProduction);
  }
};

// This function verifies the TOTP code entered by the user
export const verifyTOTPCode = async (otpCode, username, session) => {
  const totpParameters = {
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
    ChallengeName: "SOFTWARE_TOKEN_MFA", 
    Session: session,
    ChallengeResponses: {
      USERNAME: username,
      SOFTWARE_TOKEN_MFA_CODE: otpCode, 
    },
  };

  try {
    const response = await cognito.respondToAuthChallenge(totpParameters).promise();

    setCustomSession(username, response.AuthenticationResult);
    return response.AuthenticationResult;
  } catch (error) {
    const errorMsgProduction = "OTP verification failed. Please try again.";
    if (process.env.NODE_ENV === "development") {
      console.error("Error verifying OTP code:", error);
    }
    throw new Error(errorMsgProduction);
  }
};

// This function generates a TOTP secret code for the user
// and associates it with their account
export const associateTOTP = async (session) => {
    if (!session) throw new Error("Invalid session");
  
    const totpParameters = { Session: session };
    
    try {
      const response = await cognito.associateSoftwareToken(totpParameters).promise();

      devLog("TOTP secret code generated:", response.SecretCode);
    
      return {
        secretCode: response.SecretCode,
        session: response.Session, 
      };

    } catch (error) {
      const errorMsgProduction = "Failed to generate TOTP secet code.";

      devError("Error associating TOTP:", error);
      throw new Error(errorMsgProduction);
    }
  };

  // This function verifies the TOTP code entered by the user for the TOTP setup
  export const verifyTOTP = async (session, totpCode) => {
    if (!session) throw new Error("Invalid session");
  
    const totpParameters = {
      Session: session,
      UserCode: totpCode,  
    };
  
    try {
      const response = await cognito.verifySoftwareToken(totpParameters).promise();
      devLog("Verification response:", response);

      return {
        status: response.Status, 
        session: response.Session,
      };
    } catch (error) {
      const errorMsgProduction = "Invalid TOTP code.";

      devError("Error verifying TOTP:", error);
      throw new Error(errorMsgProduction);
    }
  };

// This function confirms the new password for the user
export const confirmPassword = async (username, password, session) => {
  const parameters = {
    ChallengeName: "NEW_PASSWORD_REQUIRED",
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
    ChallengeResponses: {
      USERNAME: username,
      NEW_PASSWORD: password,
    },
    Session: session,
  };

  try {
    const response = await cognito.respondToAuthChallenge(parameters).promise();
    return response.AuthenticationResult;
  } catch (error) {
    const errorMsgProduction =
      "Password confirmation failed. Please try again.";
    if (process.env.NODE_ENV === "development") {
      console.error("Error confirming password:", error);
    }
    throw new Error(errorMsgProduction);
  }
};

// This function signs out the user from the Cognito User Pool and globally
export const signOut = async () => {
  const cognitoUser = userPool.getCurrentUser();

  if (!cognitoUser) {
    console.warn("No user logged in.");
    return;
  }

  cognitoUser.getSession(async (err, session) => {
    if (err || !session) {
      console.warn("Session expired. Logging out locally.");
      cognitoUser.signOut();
      return;
    }

    const accessToken = session.getAccessToken().getJwtToken();

    try {
      await cognito.globalSignOut({ AccessToken: accessToken }).promise();
      console.log("User signed out globally.");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Global signout failed:", error);
      }
    }

    cognitoUser.signOut();
    console.log("Logged out locally.");
  });
};

// This function sets a custom session for the user
export const setCustomSession = (username, tokens) => {
  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  const accessToken = new CognitoAccessToken({
    AccessToken: tokens.AccessToken,
  });

  const idToken = new CognitoIdToken({
    IdToken: tokens.IdToken,
  });

  const refreshToken = new CognitoRefreshToken({
    RefreshToken: tokens.RefreshToken,
  });

  const session = new CognitoUserSession({
    IdToken: idToken,
    AccessToken: accessToken,
    RefreshToken: refreshToken,
  });

  cognitoUser.setSignInUserSession(session);
};
