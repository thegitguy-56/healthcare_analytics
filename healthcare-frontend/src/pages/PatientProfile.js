import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Avatar,
  Divider,
  Chip,
} from "@mui/material"
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
} from "@mui/lab"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import PersonIcon from "@mui/icons-material/Person"
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"
import EventIcon from "@mui/icons-material/Event"
import "./PatientProfile.css"

const API_URL = process.env.REACT_APP_API_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "")

function PatientProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = useState(null)
  const [treatments, setTreatments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      axios.get(`${API_URL}/patients`),
      axios.get(`${API_URL}/treatments/${id}`),
    ])
      .then(([patientsRes, treatmentsRes]) => {
        const p = patientsRes.data.find(
          (x) => x.patient_id === parseInt(id)
        )
        setPatient(p)
        setTreatments(treatmentsRes.data)
      })
      .catch(() => {
        setPatient(null)
        setTreatments([])
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!patient) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <PersonIcon
          sx={{
            fontSize: 64,
            color: "var(--text-tertiary)",
            mb: 2,
            opacity: 0.3,
          }}
        />
        <Typography
          variant="h6"
          sx={{ color: "var(--text-secondary)", fontWeight: 500 }}
        >
          Patient not found
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header with Back Button */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/patients")}
          sx={{
            textTransform: "none",
            color: "var(--primary)",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "rgba(25, 118, 210, 0.08)",
            },
          }}
        >
          Back to Patients
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Patient Information Card */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              borderRadius: "12px",
              border: "1px solid #e0e4e8",
              overflow: "hidden",
              transition: "all var(--transition-base)",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            {/* Header with Avatar */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                p: 3,
                textAlign: "center",
                color: "white",
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: "0 auto 16px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  fontSize: "32px",
                }}
              >
                {patient.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 0.5 }}
              >
                {patient.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {patient.age} years old
              </Typography>
            </Box>

            <CardContent sx={{ p: 3 }}>
              {/* Patient Details */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                  <EmailIcon sx={{ color: "var(--primary)", fontSize: 20 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--text-tertiary)",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      Email
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--text-secondary)", fontSize: "14px" }}
                    >
                      {patient.email || "Not provided"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                  <PhoneIcon sx={{ color: "var(--primary)", fontSize: 20 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--text-tertiary)",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      Phone
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--text-secondary)", fontSize: "14px" }}
                    >
                      {patient.phone || "Not provided"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                  <AdminPanelSettingsIcon sx={{ color: "var(--primary)", fontSize: 20 }} />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--text-tertiary)",
                        fontSize: "12px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      Assigned Doctor
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--text-secondary)", fontSize: "14px" }}
                    >
                      {patient.doctor || "Not assigned"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Diagnosis */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--text-tertiary)",
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Primary Diagnosis
                </Typography>
                <Chip
                  label={patient.diagnosis || "Not specified"}
                  color="error"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Treatment Timeline */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              borderRadius: "12px",
              border: "1px solid #e0e4e8",
              transition: "all var(--transition-base)",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <EventIcon sx={{ color: "var(--primary)" }} />
                Treatment Timeline
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-secondary)",
                  fontSize: "13px",
                  mb: 3,
                }}
              >
                Complete treatment history and timeline
              </Typography>

              {treatments.length > 0 ? (
                <Timeline position="alternate">
                  {treatments.map((treatment, index) => (
                    <TimelineItem key={treatment.treatment_id}>
                      <TimelineOppositeContent color="text.secondary">
                        {treatment.valid_from} - {treatment.valid_to}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={
                            treatment.status === "Completed"
                              ? "success"
                              : "primary"
                          }
                        />
                        {index < treatments.length - 1 && (
                          <TimelineConnector
                            sx={{
                              backgroundColor: "rgba(25, 118, 210, 0.2)",
                            }}
                          />
                        )}
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: 2 }}>
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: "rgba(25, 118, 210, 0.04)",
                            borderRadius: "8px",
                            border: "1px solid rgba(25, 118, 210, 0.1)",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              mb: 0.5,
                            }}
                          >
                            {treatment.treatment_type}
                          </Typography>
                          <Chip
                            label={treatment.status || "Active"}
                            size="small"
                            color={
                              treatment.status === "Completed"
                                ? "success"
                                : "primary"
                            }
                            variant="outlined"
                            sx={{ fontSize: "11px", fontWeight: 500 }}
                          />
                        </Box>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "var(--text-secondary)",
                      fontSize: "14px",
                    }}
                  >
                    No treatment records available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PatientProfile


