import React,{useState} from "react"
import axios from "axios"
import { TextField, List, ListItemButton } from "@mui/material"

const API_URL = process.env.REACT_APP_API_URL

function PatientSearch(){
const [query,setQuery] = useState("")
const [patients,setPatients] = useState([])

const search = (value)=>{

setQuery(value)

axios.get(`${API_URL}/patients`)
.then(res=>{

const filtered = res.data.filter(p =>
p.name.toLowerCase().includes(value.toLowerCase())
)

setPatients(filtered)

})

}

return(

<div>

<h3>Search Patient</h3>

<TextField
label="Search by name"
fullWidth
value={query}
onChange={e=>search(e.target.value)}
/>

<List>

{patients.map(p=>(
<ListItemButton key={p.patient_id}>
{p.name}
</ListItemButton>
))}

</List>

</div>

)

}

export default PatientSearch