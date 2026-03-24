import React, { useEffect, useState } from "react"
import axios from "axios"
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Skeleton,
} from "@mui/material"
import PeopleIcon from "@mui/icons-material/People"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"
import DescriptionIcon from "@mui/icons-material/Description"
import "./DashboardCards.css"

const API_URL = process.env.REACT_APP_API_URL

function DashboardCards() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalTreatments: 0,
    totalDiagnoses: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${API_URL}/dashboard/stats`)
      .then((res) => {
        setStats({
          totalPatients: res.data.totalPatients || 0,
          totalDoctors: res.data.totalDoctors || 0,
          totalTreatments: res.data.totalTreatments || 0,
          totalDiagnoses: res.data.totalDiagnoses || 0,
        })
      })
      .catch(() => {
        // On error, clear stats (or show error UI)
        setStats({
          totalPatients: 0,
          totalDoctors: 0,
          totalTreatments: 0,
          totalDiagnoses: 0,
        })
      })
      .finally(() => setLoading(false))
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

  const cards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: <PeopleIcon />,
      color: "#1976d2",
      lightColor: "rgba(25, 118, 210, 0.08)",
      trend: "+12.5%",
    },
    {
      title: "Active Treatments",
      value: stats.totalTreatments,
      icon: <MedicalServicesIcon />,
      color: "#00acc1",
      lightColor: "rgba(0, 172, 193, 0.08)",
      trend: "+8.2%",
    },
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      icon: <LocalHospitalIcon />,
      color: "#2e7d32",
      lightColor: "rgba(46, 125, 50, 0.08)",
      trend: "+2.1%",
    },
    {
      title: "Total Diagnoses",
      value: stats.totalDiagnoses,
      icon: <DescriptionIcon />,
      color: "#f57c00",
      lightColor: "rgba(245, 124, 0, 0.08)",
      trend: "+5.8%",
    },
  ]

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
          {loading ? (
            <Card sx={{ height: "100%", borderRadius: "12px" }}>
              <CardContent>
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="text" sx={{ mt: 2, mb: 1 }} />
                <Skeleton variant="text" width="60%" />
              </CardContent>
            </Card>
          ) : (
            <Card
              className="dashboard-card"
              sx={{
                height: "100%",
                borderRadius: "12px",
                background: "#ffffff",
                border: "1px solid #e0e4e8",
                overflow: "visible",
                transition: "all var(--transition-base)",
                "&:hover": {
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent sx={{ p: 3, height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "10px",
                      backgroundColor: card.lightColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 48,
                      height: 48,
                      color: card.color,
                      fontSize: "24px",
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#2e7d32",
                      backgroundColor: "rgba(46, 125, 50, 0.08)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "6px",
                    }}
                  >
                    {card.trend}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    fontWeight: 500,
                    mb: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {card.title}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: card.color,
                    fontSize: "32px",
                    lineHeight: 1,
                  }}
                >
                  {card.value.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      ))}
    </Grid>
  )
}

export default DashboardCards
