import React, { useState } from "react"
import axios from "axios"
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Container,
} from "@mui/material"
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety"
import PersonIcon from "@mui/icons-material/Person"
import LockIcon from "@mui/icons-material/Lock"
import "./LoginPage.css"

const API_URL = process.env.REACT_APP_API_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "")

function LoginPage({ setRole }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (!username || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await axios.post(`${API_URL}/login`, {
        username,
        password,
      })

      if (res.data.role) {
        setRole(res.data.role)
      } else {
        setError("Invalid credentials")
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login()
    }
  }

  return (
    <Box className="login-container">
      <Box
        className="login-background"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1976d2 0%, #00acc1 100%)",
          zIndex: 1,
        }}
      />

      <Box className="login-pattern" />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: 420,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                p: 4,
                textAlign: "center",
                color: "white",
              }}
            >
              <HealthAndSafetyIcon
                sx={{ fontSize: 48, mb: 2, opacity: 0.9 }}
              />
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 1, letterSpacing: "-0.5px" }}
              >
                Healthcare Analytics
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.9, fontSize: "13px" }}
              >
                Clinical Intelligence Platform
              </Typography>
            </Box>

            {/* Form Content */}
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  textAlign: "center",
                }}
              >
                Sign In
              </Typography>

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: "8px",
                    fontSize: "13px",
                    "& .MuiAlert-message": {
                      lineHeight: 1.5,
                    },
                  }}
                >
                  {error}
                </Alert>
              )}

              <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon
                        sx={{ color: "var(--primary)", mr: 1 }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: "var(--primary)",
                  },
                }}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "var(--primary)", mr: 1 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: "var(--primary)",
                  },
                }}
              />

              <Button
                variant="contained"
                fullWidth
                onClick={login}
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "15px",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                  textTransform: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                  transition: "all var(--transition-base)",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(25, 118, 210, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    background: "#cbd5e0",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Demo Credentials */}
              <Box
                sx={{
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid #e0e4e8",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-tertiary)",
                    fontSize: "12px",
                    mb: 1,
                  }}
                >
                  Demo Credentials
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    mb: 0.5,
                  }}
                >
                  Username: <strong>admin</strong>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    fontFamily: "monospace",
                  }}
                >
                  Password: <strong>admin123</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  )
}

export default LoginPage


