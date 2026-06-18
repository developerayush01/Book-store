import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import axiosInstance from "../api/axios";
import { FaHome, FaUser, FaShoppingCart, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";

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
    <>
<nav className='hidden md:flex justify-between items-center px-6 py-4 bg-slate-800 text-white'>
    {
        user ?(
            <>
            <div className='display-'>
            <Link to="/">Home</Link>
            <span>Welcome,{user.name}</span>
            <button onClick={handlelogout} className='bg-red-500 px-3 py-1 rounded'>Logout</button>
            <Link to="/profile">Profile</Link>
            <Link to="/my-cart">Cart</Link>
            </div>
            </>
        ):
        (
            <>
            <div>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </div>
            </>
        )
    }
</nav>

<div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 text-white flex justify-around py-3 border-t border-slate-700">

        <Link to="/" className="flex flex-col items-center text-xs">
          <FaHome size={20} />
          Home
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="flex flex-col items-center text-xs">
              <FaUser size={20} />
              Profile
            </Link>

            <Link to="/my-cart" className="flex flex-col items-center text-xs">
              <FaShoppingCart size={20} />
              Cart
            </Link>

            <button
              onClick={handlelogout}
              className="flex flex-col items-center text-xs"
            >
              <FaSignOutAlt size={20} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="flex flex-col items-center text-xs">
              <FaSignInAlt size={20} />
              Login
            </Link>

            <Link to="/register" className="flex flex-col items-center text-xs">
              <FaUser size={20} />
              Register
            </Link>
          </>
        )}
      </div>
</>
)
}

export default Navbar;