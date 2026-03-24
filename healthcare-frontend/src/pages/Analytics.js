import React, { useEffect, useState } from "react"
import axios from "axios"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Paper,
} from "@mui/material"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from "chart.js"
import { Bar, Line, Pie, Radar } from "react-chartjs-2"
import AnalyticsIcon from "@mui/icons-material/Analytics"
import "./Analytics.css"

const API_URL = process.env.REACT_APP_API_URL

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
)

function Analytics() {
  const [chartData, setChartData] = useState({
    treatmentDuration: null,
    diseaseDistribution: null,
    patientTrends: null,
    ageDistribution: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${API_URL}/analytics/summary`)
      .then((res) => {
        setChartData({
          treatmentDuration: res.data.treatmentDuration || null,
          diseaseDistribution: res.data.diseaseDistribution || null,
          patientTrends: res.data.patientTrends || null,
          ageDistribution: res.data.ageDistribution || null,
        })
      })
      .catch(async () => {
        try {
          const diseasesRes = await axios.get(`${API_URL}/analytics/diseases`)
          setChartData({
            treatmentDuration: null,
            diseaseDistribution: {
              labels: diseasesRes.data.map((d) => d.disease),
              datasets: [
                {
                  data: diseasesRes.data.map((d) => d.total),
                  backgroundColor: [
                    "rgba(25, 118, 210, 0.8)",
                    "rgba(0, 172, 193, 0.8)",
                    "rgba(46, 125, 50, 0.8)",
                    "rgba(245, 124, 0, 0.8)",
                    "rgba(198, 40, 40, 0.8)",
                    "rgba(123, 31, 162, 0.8)",
                  ],
                  borderColor: [
                    "rgb(25, 118, 210)",
                    "rgb(0, 172, 193)",
                    "rgb(46, 125, 50)",
                    "rgb(245, 124, 0)",
                    "rgb(198, 40, 40)",
                    "rgb(123, 31, 162)",
                  ],
                  borderWidth: 2,
                  fill: true,
                },
              ],
            },
            patientTrends: null,
            ageDistribution: null,
          })
        } catch {
          setChartData({
            treatmentDuration: null,
            diseaseDistribution: null,
            patientTrends: null,
            ageDistribution: null,
          })
        }
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

// Removed all demo chart data and stray code

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 13,
            weight: "500",
          },
          color: "var(--text-secondary)",
        },
      },
      tooltip: {
        backgroundColor: "rgba(26, 26, 46, 0.9)",
        padding: 12,
        titleFont: { size: 14, weight: "600" },
        bodyFont: { size: 13 },
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "var(--text-primary)",
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AnalyticsIcon sx={{ fontSize: 32, color: "var(--primary)" }} />
          Advanced Analytics
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--text-secondary)", fontSize: "14px" }}
        >
          Comprehensive healthcare data analysis and insights
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Treatment Duration Distribution */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card
              sx={{
                borderRadius: "12px",
                border: "1px solid #e0e4e8",
                transition: "all var(--transition-base)",
                "&:hover": {
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                  transform: "translateY(-4px)",
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
                  }}
                >
                  Treatment Duration Distribution
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    mb: 3,
                  }}
                >
                  Treatment duration frequency analysis
                </Typography>
                <Box sx={{ height: 300, position: "relative" }}>
                  {chartData.treatmentDuration && (
                    <Bar
                      data={chartData.treatmentDuration}
                      options={{
                        ...chartOptions,
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: { color: "rgba(0, 0, 0, 0.05)" },
                          },
                          x: {
                            grid: { display: false },
                          },
                        },
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Disease Distribution Pie Chart */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card
              sx={{
                borderRadius: "12px",
                border: "1px solid #e0e4e8",
                transition: "all var(--transition-base)",
                "&:hover": {
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                  transform: "translateY(-4px)",
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
                  }}
                >
                  Disease Distribution Analysis
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    mb: 3,
                  }}
                >
                  Percentage breakdown of diagnosed conditions
                </Typography>
                <Box sx={{ height: 300, position: "relative" }}>
                  {chartData.diseaseDistribution && (
                    <Pie
                      data={chartData.diseaseDistribution}
                      options={{
                        ...chartOptions,
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Patient Trends Over Time */}
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: "12px",
                border: "1px solid #e0e4e8",
                transition: "all var(--transition-base)",
                "&:hover": {
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                  transform: "translateY(-4px)",
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
                  }}
                >
                  Patient Trends Over Time
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    mb: 3,
                  }}
                >
                  Weekly admissions vs treatment completion rates
                </Typography>
                <Box sx={{ height: 320, position: "relative" }}>
                  {chartData.patientTrends && (
                    <Line
                      data={chartData.patientTrends}
                      options={{
                        ...chartOptions,
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: { color: "rgba(0, 0, 0, 0.05)" },
                          },
                          x: {
                            grid: { color: "rgba(0, 0, 0, 0.05)" },
                          },
                        },
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Age Distribution Radar Chart */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card
              sx={{
                borderRadius: "12px",
                border: "1px solid #e0e4e8",
                transition: "all var(--transition-base)",
                "&:hover": {
                  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                  transform: "translateY(-4px)",
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
                  }}
                >
                  Patient Age Distribution
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    mb: 3,
                  }}
                >
                  Patient population by age group
                </Typography>
                <Box sx={{ height: 300, position: "relative" }}>
                  {chartData.ageDistribution && (
                    <Radar
                      data={chartData.ageDistribution}
                      options={{
                        ...chartOptions,
                        scales: {
                          r: {
                            beginAtZero: true,
                            grid: { color: "rgba(0, 0, 0, 0.05)" },
                          },
                        },
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Key Metrics */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Grid container spacing={2}>
              {[
                {
                  title: "Total Patients Analyzed",
                  value: "1,245",
                  color: "var(--primary)",
                },
                {
                  title: "Treatment Success Rate",
                  value: "94.2%",
                  color: "var(--success)",
                },
                {
                  title: "Avg Treatment Duration",
                  value: "12.5 days",
                  color: "var(--secondary)",
                },
                {
                  title: "Active Treatments",
                  value: "287",
                  color: "var(--warning)",
                },
              ].map((metric, index) => (
                <Grid size={{ xs: 12 }} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: "8px",
                      backgroundColor: "#fafbfc",
                      border: "1px solid #e0e4e8",
                      transition: "all var(--transition-base)",
                      "&:hover": {
                        backgroundColor: "#f5f7fb",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "var(--text-secondary)",
                        fontSize: "12px",
                        fontWeight: 600,
                        mb: 1,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {metric.title}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: metric.color,
                        fontWeight: 700,
                        fontSize: "28px",
                      }}
                    >
                      {metric.value}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default Analytics
