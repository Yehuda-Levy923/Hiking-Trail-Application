// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d59", // forest green
      contrastText: "#fff"
    },
    secondary: {
      main: "#8d6e63" // earth brown
    },
    background: {
      default: "#f4f7f5",
      paper: "#ffffff"
    },
    text: {
      primary: "#0f1720"
    }
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none"
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 6px 18px rgba(20,30,20,0.06)"
        }
      }
    }
  }
});

export default theme;
