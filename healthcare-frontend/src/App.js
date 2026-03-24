import React, { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import DashboardLayout from "./layout/DashboardLayout"

import Dashboard from "./pages/Dashboard"
import Patients from "./pages/Patients"
import Analytics from "./pages/Analytics"
import Admin from "./pages/Admin"
import LoginPage from "./pages/LoginPage"
import PatientProfile from "./pages/PatientProfile"

function App() {
  const [role, setRole] = useState(
    localStorage.getItem("userRole") || null
  )
  const normalizedRole = String(role || "").toLowerCase()
  const isAdmin = normalizedRole === "admin"

  const handleLogout = () => {
    setRole(null)
    localStorage.removeItem("userRole")
  }

  if (!role) {
    return <LoginPage setRole={(r) => {
      setRole(r)
      localStorage.setItem("userRole", r)
    }} />
  }

  return (
    <BrowserRouter>
      <DashboardLayout onLogout={handleLogout} userRole={role}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/" replace />} />
          <Route path="/patient/:id" element={<PatientProfile />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  )
}

export default App


