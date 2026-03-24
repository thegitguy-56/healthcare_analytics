import React, { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Typography,
  InputAdornment,
  Chip,
  Button,
  Grid,
} from "@mui/material"
import axios from "axios"
import { Link } from "react-router-dom"
import SearchIcon from "@mui/icons-material/Search"
import PersonIcon from "@mui/icons-material/Person"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import "./Patients.css"

const API_URL = process.env.REACT_APP_API_URL

function Patients() {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)

  // State for new patient form
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    address: ""
  })
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState("")

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${API_URL}/patients`)
      .then((res) => {
        setPatients(res.data)
        setFilteredPatients(res.data)
      })
      .catch(() => {
        setPatients([])
        setFilteredPatients([])
      })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Add new patient handler
  const handleAddPatient = async (e) => {
    e.preventDefault()
    setAdding(true)
    setAddError("")
    try {
      await axios.post(`${API_URL}/patients`, {
        ...newPatient,
        name: newPatient.name.trim(),
        address: newPatient.address.trim(),
        age: Number(newPatient.age),
      })
      // Refresh patient list
      setLoading(true)
      const res = await axios.get(`${API_URL}/patients`)
      setPatients(res.data)
      setFilteredPatients(res.data)
      setNewPatient({ name: "", age: "", gender: "", address: "" })
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to add patient. Please check your input."
      setAddError(message)
    } finally {
      setAdding(false)
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setPage(0)
    const filtered = patients.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.doctor && p.doctor.toLowerCase().includes(query.toLowerCase()))
    )
    setFilteredPatients(filtered)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success"
      case "Recovering":
        return "warning"
      case "Discharged":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* Add Patient Form */}
      <Card sx={{ borderRadius: "12px", border: "1px solid #e0e4e8", mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Add New Patient
          </Typography>
          <form onSubmit={handleAddPatient} autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Name"
                  value={newPatient.name}
                  onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                  required
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Age"
                  type="number"
                  value={newPatient.age}
                  onChange={e => setNewPatient({ ...newPatient, age: e.target.value })}
                  required
                  fullWidth
                  size="small"
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Gender"
                  select
                  value={newPatient.gender}
                  onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}
                  required
                  fullWidth
                  size="small"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Address"
                  value={newPatient.address}
                  onChange={e => setNewPatient({ ...newPatient, address: e.target.value })}
                  required
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1} sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={adding}
                  fullWidth
                  sx={{ minWidth: 100 }}
                >
                  {adding ? "Adding..." : "Add"}
                </Button>
              </Grid>
            </Grid>
            {addError && (
              <Typography color="error" sx={{ mt: 1 }}>
                {addError}
              </Typography>
            )}
          </form>
        </CardContent>
      </Card>
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
          <PersonIcon sx={{ fontSize: 32, color: "var(--primary)" }} />
          Patient Management
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--text-secondary)", fontSize: "14px" }}
        >
          View and manage patient records
        </Typography>
      </Box>

      {/* Search Card */}
      <Card
        sx={{
          borderRadius: "12px",
          border: "1px solid #e0e4e8",
          mb: 3,
          transition: "all var(--transition-base)",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            placeholder="Search patients by name or doctor..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: "var(--text-tertiary)", mr: 1 }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                fontSize: "14px",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "var(--primary)",
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Patients Table */}
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
        {loading ? (
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
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead
                  sx={{
                    backgroundColor: "rgba(25, 118, 210, 0.05)",
                    borderBottom: "2px solid #e0e4e8",
                  }}
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Name
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Age
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Doctor
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Last Treatment
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPatients
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((patient, index) => (
                      <TableRow
                        key={patient.patient_id}
                        sx={{
                          borderBottom: "1px solid #e0e4e8",
                          transition: "background-color var(--transition-base)",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.03)",
                          },
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: "var(--primary)",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        >
                          <Link
                            to={`/patient/${patient.patient_id}`}
                            style={{
                              color: "inherit",
                              textDecoration: "none",
                            }}
                          >
                            {patient.name}
                          </Link>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "var(--text-secondary)",
                            fontSize: "14px",
                          }}
                        >
                          {patient.age}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "var(--text-secondary)",
                            fontSize: "14px",
                          }}
                        >
                          {patient.doctor || "Not assigned"}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "var(--text-secondary)",
                            fontSize: "14px",
                          }}
                        >
                          {patient.last_treatment ? (
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                              <CalendarTodayIcon sx={{ fontSize: 16 }} />
                              {new Date(
                                patient.last_treatment
                              ).toLocaleDateString()}
                            </Box>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={patient.status || "Active"}
                            size="small"
                            color={getStatusColor(patient.status)}
                            variant="outlined"
                            sx={{
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredPatients.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: "1px solid #e0e4e8",
                backgroundColor: "#fafbfc",
              }}
            />
          </>
        )}
      </Card>

      {!loading && filteredPatients.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >
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
            No patients found
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default Patients
