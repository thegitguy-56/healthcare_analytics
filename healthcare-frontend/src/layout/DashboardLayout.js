import React, { useState } from "react"
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import PeopleIcon from "@mui/icons-material/People"
import BarChartIcon from "@mui/icons-material/BarChart"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import LogoutIcon from "@mui/icons-material/Logout"
import NotificationsIcon from "@mui/icons-material/Notifications"
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety"
import { Link, useLocation } from "react-router-dom"
import "./DashboardLayout.css"

function DashboardLayout({ children, onLogout, userRole = "admin" }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const location = useLocation()
  const normalizedRole = String(userRole || "").toLowerCase()
  const isAdmin = normalizedRole === "admin"

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    onLogout()
  }

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/patients", label: "Patients", icon: <PeopleIcon /> },
    { path: "/analytics", label: "Analytics", icon: <BarChartIcon /> },
    ...(isAdmin ? [{ path: "/admin", label: "Admin", icon: <AdminPanelSettingsIcon /> }] : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="dashboard-layout">
      {/* Top Navigation Bar */}
      <AppBar position="fixed" className="navbar">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <HealthAndSafetyIcon sx={{ fontSize: 28, color: "#1976d2" }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Healthcare Analytics
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#4a5568",
                fontSize: "13px",
                fontWeight: 500,
                textTransform: "capitalize",
              }}
            >
              {userRole}
            </Typography>

            <IconButton
              color="inherit"
              sx={{
                color: "#4a5568",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              }}
            >
              <NotificationsIcon />
            </IconButton>

            <Avatar
              src="https://www.gravatar.com/avatar/default?s=40&d=identicon"
              sx={{
                width: 40,
                height: 40,
                cursor: "pointer",
                backgroundColor: "#1976d2",
              }}
              onClick={handleMenuOpen}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{ mt: 1 }}
            >
              <MenuItem disabled sx={{ color: "#4a5568", fontWeight: 500 }}>
                {userRole}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: "#c62828" }}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Drawer
        variant="permanent"
        anchor="left"
        className="sidebar"
        sx={{
          "& .MuiDrawer-paper": {
            width: 260,
            marginTop: "64px",
            height: "calc(100vh - 64px)",
            backgroundColor: "#ffffff",
            borderRight: "1px solid #e0e4e8",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "#4a5568",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontSize: "12px",
            }}
          >
            Main Menu
          </Typography>
        </Box>

        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              component={Link}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              sx={{
                borderRadius: "8px",
                mb: 1,
                px: 2,
                py: 1.5,
                color: isActive(item.path) ? "#1976d2" : "#4a5568",
                backgroundColor: isActive(item.path)
                  ? "rgba(25, 118, 210, 0.08)"
                  : "transparent",
                fontWeight: isActive(item.path) ? 600 : 500,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  color: "#1976d2",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: 40,
                  fontSize: "20px",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: "inherit",
                    fontSize: "14px",
                  },
                }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2, mx: 2 }} />

        <Box sx={{ px: 2, py: 2 }}>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: "8px",
              px: 2,
              py: 1.5,
              color: "#c62828",
              fontWeight: 500,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(198, 40, 40, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "14px",
                },
              }}
            />
          </ListItem>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box className="main-content">
        <Box component="main" sx={{ pt: 3, pb: 4 }}>
          {children}
        </Box>
      </Box>
    </div>
  )
}

export default DashboardLayout


