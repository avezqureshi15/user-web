// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2E368E", // Black color
    },
    secondary: {
      main: "#F7F8FB", // White color
    },
  },
  typography: {
    h6: {
      color: "#2E368E",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          backgroundColor: "#2E368E",
          padding: "8px",
        },
      },

      defaultProps: {
        style: {
          textTransform: "capitalize",
          fontWeight: "bold",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;
