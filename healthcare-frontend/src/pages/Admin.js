import React, { useState, useEffect } from "react"
import axios from "axios"
import {
Box,
Card,
CardContent,
Typography,
Grid,
Table,
TableBody,
TableCell,
TableContainer,
TableHead,
TableRow,
Button,
Dialog,
DialogTitle,
DialogContent,
DialogActions,
TextField,
Select,
MenuItem,
FormControl,
InputLabel,
Chip,
CircularProgress,
} from "@mui/material"

import SecurityIcon from "@mui/icons-material/Security"
import PersonIcon from "@mui/icons-material/Person"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AccessTimeIcon from "@mui/icons-material/AccessTime"

import "./Admin.css"

function Admin() {

const [users, setUsers] = useState([])
const [accessLogs, setAccessLogs] = useState([])
const [loading, setLoading] = useState(true)
const [errorMessage, setErrorMessage] = useState("")

const [openUserDialog, setOpenUserDialog] = useState(false)

const [newUser, setNewUser] = useState({
username: "",
password: "",
role: "doctor",
})

const API = process.env.REACT_APP_API_URL

useEffect(() => {
fetchAdminData()
}, [])

const fetchAdminData = async () => {
  try {
    setErrorMessage("")
    const usersRes = await axios.get(`${API}/admin/users`);
    const logsRes = await axios.get(`${API}/admin/access-logs`);
    setUsers(usersRes.data);
    setAccessLogs(logsRes.data);
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to load admin data";
    setErrorMessage(message)
    console.error("Admin API Error:", err);
  } finally {
    setLoading(false);
  }
};

const handleAddUser = async () => {
  if (!newUser.username || !newUser.password) {
    setErrorMessage("Username and password are required")
    return
  }
  try {
    setErrorMessage("")
    await axios.post(`${API}/admin/users`, newUser);
    fetchAdminData();
    setNewUser({
      username: "",
      password: "",
      role: "doctor",
    });
    setOpenUserDialog(false);
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to add user";
    setErrorMessage(message)
    console.error("Add user failed", err);
  }
};

const handleDeleteUser = async (id) => {
  try {
    setErrorMessage("")
    await axios.delete(`${API}/admin/users/${id}`);
    fetchAdminData();
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to delete user";
    setErrorMessage(message)
    console.error("Delete user failed", err);
  }
};

const getRoleColor = (role) => {
if (role === "admin") return "error"
if (role === "doctor") return "primary"
if (role === "nurse") return "info"
return "default"
}

const getStatusColor = (status) => {
return status === "Active" ? "success" : "default"
}

const getLogStatusColor = (status) => {
return status === "Success" ? "success" : "error"
}

return (
<Box sx={{ pb:4 }}>

  <Box sx={{ mb:4 }}>
    <Typography variant="h4" sx={{fontWeight:700,display:"flex",gap:1}}>
      <SecurityIcon/> Administration Panel
    </Typography>
    <Typography variant="body2">
      Manage users and system access
    </Typography>
    {errorMessage && (
      <Typography color="error" sx={{ mt: 1 }}>
        {errorMessage}
      </Typography>
    )}
  </Box>

  {loading ? (

    <Box sx={{display:"flex",justifyContent:"center",py:8}}>
      <CircularProgress/>
    </Box>

  ) : (

    <Grid container spacing={3}>

      <Grid item xs={12}>

        <Card>

          <CardContent>

            <Box sx={{display:"flex",justifyContent:"space-between",mb:3}}>

              <Box sx={{display:"flex",alignItems:"center",gap:1}}>
                <PersonIcon/>
                <Typography variant="h6">User Management</Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon/>}
                onClick={()=>setOpenUserDialog(true)}
              >
                Add User
              </Button>

            </Box>

            <TableContainer>

              <Table>

                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>

                  {users.map(user => (

                    <TableRow key={user.user_id}>

                      <TableCell>{user.username}</TableCell>

                      <TableCell>{user.email}</TableCell>

                      <TableCell>
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role)}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={user.status}
                          color={getStatusColor(user.status)}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>

                      <TableCell align="center">

                        <Button size="small" startIcon={<EditIcon/>}>
                          Edit
                        </Button>

                        <Button
                          size="small"
                          startIcon={<DeleteIcon/>}
                          color="error"
                          onClick={()=>handleDeleteUser(user.user_id)}
                        >
                          Delete
                        </Button>

                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </TableContainer>

          </CardContent>

        </Card>

      </Grid>

      <Grid item xs={12}>

        <Card>

          <CardContent>

            <Box sx={{display:"flex",gap:1,mb:3}}>
              <AccessTimeIcon/>
              <Typography variant="h6">Access Logs</Typography>
            </Box>

            <TableContainer>

              <Table>

                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>

                  {accessLogs.map(log => (

                    <TableRow key={log.log_id}>

                      <TableCell>{log.username}</TableCell>

                      <TableCell>{log.action}</TableCell>

                      <TableCell>{log.timestamp}</TableCell>

                      <TableCell>
                        <Chip
                          label={log.status}
                          color={getLogStatusColor(log.status)}
                          size="small"
                        />
                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </TableContainer>

          </CardContent>

        </Card>

      </Grid>

    </Grid>

  )}

  <Dialog open={openUserDialog} onClose={()=>setOpenUserDialog(false)}>

    <DialogTitle>Add User</DialogTitle>

    <DialogContent>

      <TextField
        fullWidth
        label="Username"
        margin="normal"
        value={newUser.username}
        onChange={e=>setNewUser({...newUser,username:e.target.value})}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={newUser.password}
        onChange={e=>setNewUser({...newUser,password:e.target.value})}
      />

      <FormControl fullWidth margin="normal">

        <InputLabel>Role</InputLabel>

        <Select
          value={newUser.role}
          label="Role"
          onChange={e=>setNewUser({...newUser,role:e.target.value})}
        >

          <MenuItem value="doctor">Doctor</MenuItem>
          <MenuItem value="nurse">Nurse</MenuItem>

        </Select>

      </FormControl>

    </DialogContent>

    <DialogActions>

      <Button onClick={()=>setOpenUserDialog(false)}>
        Cancel
      </Button>

      <Button variant="contained" onClick={handleAddUser}>
        Add User
      </Button>

    </DialogActions>

  </Dialog>

  </Box>
);
}

export default Admin
