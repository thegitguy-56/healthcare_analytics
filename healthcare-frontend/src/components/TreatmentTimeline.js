import React,{useState} from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

function TreatmentTimeline(){
const [patientId,setPatientId] = useState("")
const [timeline,setTimeline] = useState([])

const loadTimeline = ()=>{

axios.get(`${API_URL}/treatments/${patientId}`)
.then(res=>{
setTimeline(res.data)
})

}

return(

<div>

<h3>Treatment Timeline</h3>

<input
placeholder="Enter patient ID"
onChange={e=>setPatientId(e.target.value)}
/>

<button onClick={loadTimeline}>
Load Timeline
</button>

<ul>

{timeline.map((t,i)=>(
<li key={i}>
{t.valid_from} → {t.valid_to} : {t.treatment_type}
</li>
))}

</ul>

</div>

)

}

export default TreatmentTimeline