import React,{useEffect,useState} from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : "")

function AccessLogs(){
const [logs,setLogs] = useState([])

useEffect(()=>{

axios.get(`${API_URL}/logs`)
.then(res=>{
setLogs(res.data)
})

},[])

return(

<div>

<h3>Access Logs</h3>

<table>

<thead>
<tr>
<th>User Role</th>
<th>Table</th>
<th>Time</th>
</tr>
</thead>

<tbody>

{logs.map(l=>(
<tr key={l.log_id}>
<td>{l.user_role}</td>
<td>{l.table_accessed}</td>
<td>{l.access_time}</td>
</tr>
))}

</tbody>

</table>

</div>

)

}

export default AccessLogs

