import {useNavigate,Link} from 'react-router-dom'
import {useState} from 'react'
import axiosInstance from '../api/axios'

function Register() {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [phone,setPhone]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    const [error, setError] = useState("");

    const handleRegister=async()=>{
    try {
        await axiosInstance.post("/api/users/register",{name,email,phone,password});
        navigate("/login");
    } catch (error) {
        setError(error.response.data.message);
    }
}

return (
        <div>
            <h2>Register</h2>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder='Enter Your Name'/>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter Your Email'/>
            <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder='Enter Phone'/>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter password'/>
            <button onClick={handleRegister}>Register</button>
            <p>Already have an account ?</p><span><Link to='/login'>Login</Link>  </span>
            {error && <p>{error}</p>}
        </div>

    )
}




export default Register;