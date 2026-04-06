import {useNavigate,Link} from 'react-router-dom'
import {useState} from 'react'
import {useAuth} from '../context/AuthContext'
import axiosInstance from '../api/axios'

function Login() {
    const [phone,setPhone]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    const {setUser}=useAuth();
    const [error, setError] = useState("");

    const handleLogin=async()=>{
        try {
            await axiosInstance.post("/api/users/login",{phone,password});

            const profile=await axiosInstance.get("/api/users/profile");
            setUser(profile.data.user);
            navigate("/");
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    return (
        <div>
            <h2>Login</h2>
            <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder='Enter Phone'/>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter password'/>
            <button onClick={handleLogin}>Login</button>
            <p>Do not have account ?</p><span><Link to='/register'>Sign Up</Link>  </span>
            {error && <p>{error}</p>}
        </div>

    )
}
export default Login;