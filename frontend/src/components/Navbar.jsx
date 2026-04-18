import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import axiosInstance from "../api/axios";

function Navbar(){
    const { user, mode, setMode,setUser } = useAuth();
    const navigate=useNavigate();
    const handlelogout=async()=>{
        try {
            await axiosInstance.post("api/users/logout");
            setUser("");
            navigate("/");
        } catch (error) {
            alert("You need to login");
        }
    }
return(
<nav>
    {
        user ?(
            <>
            <Link to="/">Home</Link>
            <span>Welcome,{user.name}</span>
            <button onClick={handlelogout}>Logout</button>
            <Link to="/profile">Profile</Link>
            <Link to="/my-cart">Cart</Link>
            </>
        ):
        (
            <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </>
        )
    }
</nav>
)
}

export default Navbar;