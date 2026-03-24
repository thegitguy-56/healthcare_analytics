import { createTheme } from "@mui/material/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#00acc1",
      light: "#4dd0e1",
      dark: "#00838f",
      contrastText: "#ffffff",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
    },
    warning: {
      main: "#f57c00",
      light: "#ffb74d",
      dark: "#e65100",
    },
    error: {
      main: "#c62828",
      light: "#ef5350",
      dark: "#b71c1c",
    },
    info: {
      main: "#0277bd",
      light: "#03a9f4",
      dark: "#01579b",
    },
    background: {
      default: "#f5f7fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a2e",
      secondary: "#4a5568",
      disabled: "#cbd5e0",
    },
    divider: "#e0e4e8",
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "32px",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.5px",
    },
    h2: {
      fontSize: "28px",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.5px",
    },
    h3: {
      fontSize: "24px",
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "20px",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "16px",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "14px",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "13px",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
    caption: {
      fontSize: "12px",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
        contained: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#1a1a2e",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          borderBottom: "1px solid #e0e4e8",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e0e4e8",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "collapse",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e0e4e8",
          padding: "16px",
        },
        head: {
          backgroundColor: "rgba(25, 118, 210, 0.05)",
          fontWeight: 600,
          fontSize: "13px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.03)",
          },
        },
      },
    },
  },
})

export default theme


