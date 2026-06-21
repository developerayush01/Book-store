import {useNavigate,useLocation,Link} from 'react-router-dom'
import {useState} from 'react'
import {useAuth} from '../context/AuthContext'
import axiosInstance from '../api/axios'

function Login() {
    const [phone,setPhone]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    const location=useLocation();
    const {setUser}=useAuth();
    const [error, setError] = useState("");


    const redirectState = location.state;
    
     const handleLogin=async()=>{
        try {
            await axiosInstance.post("/api/users/login",{phone,password});

            const profile=await axiosInstance.get("/api/users/profile");
            setUser(profile.data.user);

            if (redirectState?.action === "addToCart") {
    try {
        await axiosInstance.post("/api/cart/add-cart", {
            book_id: redirectState.book_id
        });
    } catch (error) {
        alert("Cannot add to cart");
    }
    navigate(redirectState.from || "/", { state: { cartSuccess: true } });

} else if (redirectState?.action === "buyNow") {
    navigate(redirectState.from || "/", {
        state: { triggerBuyNow: true }
    });
} else {
    navigate(redirectState?.from || "/");
}

        } catch (error) {
            setError(error.response.data.message);
        }
    }


    return (
        <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4">

  <div className="bg-white w-full max-w-sm rounded-lg shadow-sm p-6">

    {/* TITLE */}
    <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">
      Login
    </h2>

    {/* ERROR */}
    {error && (
      <p className="text-red-500 text-sm text-center mb-3">
        {error}
      </p>
    )}

    {/* INPUTS */}
    <div className="flex flex-col gap-3">

      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter Phone"
        className="border p-2 rounded text-sm"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Password"
        className="border p-2 rounded text-sm"
      />

    </div>

    {/* BUTTON */}
    <button
      onClick={handleLogin}
      className="w-full mt-5 bg-slate-800 text-white py-2 rounded text-sm hover:bg-slate-700 transition"
    >
      Login
    </button>

    {/* SIGNUP */}
    <p className="text-xs text-center mt-4 text-gray-600">
      Don’t have an account?
      <Link
        to="/register"
        state={redirectState}
        className="text-blue-600 ml-1 hover:underline"
      >
        Sign Up
      </Link>
    </p>

  </div>

</div>

    )
}
export default Login;