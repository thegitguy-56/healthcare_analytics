import React, {useEffect, useState} from "react"
import axios from "axios"

import { Link } from "react-router-dom"

const API_URL = process.env.REACT_APP_API_URL

function PatientList(){
const [patients,setPatients] = useState([])

useEffect(()=>{

axios.get(`${API_URL}/patients`)
.then(res=>{
setPatients(res.data)
})

},[])

return(

<div>

<h2>Patients</h2>

<ul>

{patients.map(p=>(
<li key={p.patient_id}>
	<Link to={`/patient/${p.patient_id}`}>
		{p.name}
	</Link>
</li>
))}

</ul>

</div>

)

}

export default PatientList