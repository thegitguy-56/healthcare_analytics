import React, { useEffect, useState } from "react"
import axios from "axios"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
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
} from "chart.js"
import { Bar, Line, Doughnut } from "react-chartjs-2"
import DashboardCards from "../components/DashboardCards"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import "./Dashboard.css"

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
  ArcElement
)

function Dashboard() {
  // Demo chart data constants defined ONCE above useEffect for stable reference

  const [chartData, setChartData] = useState({
    barChart: null,
    lineChart: null,
    doughnutChart: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${API_URL}/dashboard/charts`)
      .then((res) => {
        setChartData({
          barChart: res.data.barChart,
          lineChart: res.data.lineChart,
          doughnutChart: res.data.doughnutChart,
        })
      })
      .catch(() => {
        setChartData({
          barChart: null,
          lineChart: null,
          doughnutChart: null,
        })
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          <TrendingUpIcon sx={{ fontSize: 32, color: "var(--primary)" }} />
          Dashboard Overview
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--text-secondary)", fontSize: "14px" }}
        >
          Real-time healthcare analytics and patient insights
        </Typography>
      </Box>

      {/* Key Metrics Cards */}
      <DashboardCards />

      {/* Charts Section */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Disease Distribution */}
          <Grid size={{ xs: 12, lg: 8 }}>
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
                  }}
                >
                  Disease Frequency Distribution
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    mb: 3,
                  }}
                >
                  Top diagnosed conditions across patient population
                </Typography>
                <Box sx={{ height: 300, position: "relative" }}>
                  {chartData.barChart && (
                    <Bar
                      data={chartData.barChart}
                      options={{
                        ...chartOptions,
                        indexAxis: "x",
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: "rgba(0, 0, 0, 0.05)",
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                          },
                        },
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Treatment Status */}
          <Grid size={{ xs: 12, lg: 4 }}>
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
                  }}
                >
                  Treatment Status
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    mb: 3,
                  }}
                >
                  Current treatment progress overview
                </Typography>
                <Box sx={{ height: 250, position: "relative" }}>
                  {chartData.doughnutChart && (
                    <Doughnut
                      data={chartData.doughnutChart}
                      options={{
                        ...chartOptions,
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Admissions Trend */}
          <Grid size={{ xs: 12 }}>
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
                  }}
                >
                  Monthly Patient Admissions Trend
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    mb: 3,
                  }}
                >
                  12-month patient admission statistics
                </Typography>
                <Box sx={{ height: 320, position: "relative" }}>
                  {chartData.lineChart && (
                    <Line
                      data={chartData.lineChart}
                      options={{
                        ...chartOptions,
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: "rgba(0, 0, 0, 0.05)",
                            },
                          },
                          x: {
                            grid: {
                              color: "rgba(0, 0, 0, 0.05)",
                            },
                          },
                        },
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default Dashboard
