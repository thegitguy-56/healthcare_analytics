import React,{useState} from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

function Login({setRole}){
const [username,setUsername] = useState("")
const [password,setPassword] = useState("")

const login = ()=>{

axios.post(`${API_URL}/login`,{
username,
password
})
.then(res=>{
if(res.data.role){
setRole(res.data.role)
}
})

}

return(

<div>

<h2>Login</h2>

<input
placeholder="Username"
onChange={e=>setUsername(e.target.value)}
/>

<input
type="password"
placeholder="Password"
onChange={e=>setPassword(e.target.value)}
/>

<button onClick={login}>
Login
</button>

</div>

)

}

export default Login