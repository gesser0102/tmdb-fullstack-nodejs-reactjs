import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fff",
      contrastText: "#111"
    },
    secondary: {
      main: "#f44336",
      contrastText: "#ffffff"
    },
    background: {
      default: "#1c1044",
      paper: "#1c1044"
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    }
  }
});
