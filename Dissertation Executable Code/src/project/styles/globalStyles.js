import { colors } from "./colors";

// Global styles for the project
export const globalStyles = {

  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: colors.primary,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "300px",
    backgroundColor: colors.white,
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },

  // Text
  header: {
    color: "white",
    fontSize: "2em",
    fontWeight: "bold",
    textAlign: "center",
  },

  title: {
    fontSize: "1.2em",
    margin: "10px",
  },

  description: {
    textAlign: "center",
    fontSize: "1em",
    color: "black",
  },

  errorText: {
    color: "red",
    margin: "5px 0",
    fontSize: "1em",
  },

  defaultText: {
    color: "white",
    fontSize: "1em",
  },
  
  // Input and Buttons
  input: {
    width: "80%",
    padding: "12px 10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1em",
    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
  },

  squareButton: {
    width: "80%",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "6px",
    color: colors.white,
    fontWeight: "bold",
    fontSize: "1em",
    cursor: "pointer",
    textAlign: "center",
  },

  circularButton: {
    width: "60%",
    borderRadius: "25px",
    backgroundColor: colors.blue,
  },

  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },

  blueBackground: {
    backgroundColor: colors.blue,
  },

  dangerBackground: {
    backgroundColor: colors.red,
  },
  
  // Margin and Padding
  marginArea: {
    marginTop: "10px",
    marginBottom: "10px",
  },

  marginBottom: {
    marginBottom: "25px",
  },

  marginTop: {
    marginTop: "25px",
  },

  // Flexibility
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  flexColumn: {
    flexDirection: "column",
    alignItems: "center",
  },

  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
};