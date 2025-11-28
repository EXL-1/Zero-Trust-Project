// Console log functions for development
  
// This function is used for developer warning logs
  export const devWarn = (message, value) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(message, value ?? "");
    }
  };
  
// This function is used for developer error logs
  export const devError = (message, value) => {
    if (process.env.NODE_ENV === "development") {
      console.error(message, value ?? "");
    }
  };
  
// This function is used for regular developer logs
  export const devLog = (message, value) => {
    if (process.env.NODE_ENV === "development") {
      console.log(message, value ?? "");
    }
  };