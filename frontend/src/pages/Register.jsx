import {useNavigate,useLocation,Link} from 'react-router-dom'
import {useState} from 'react'
import axiosInstance from '../api/axios'

function Register() {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();
    const location=useLocation();
    const [error, setError] = useState("");


     const redirectState = location.state;

    const handleRegister = async () => {
  try {
    await axiosInstance.post("/api/users/register", { name, email, password });
    navigate("/verify", { state: { ...location.state, email } });
  } catch (error) {
    setError(error.response?.data?.message || "Registration failed");
  }
};

return (
        <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4">

  <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">

    {/* Heading */}
    <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
      Create Account
    </h2>

    <p className="text-center text-gray-500 text-sm mb-6">
      Join our second-hand book marketplace
    </p>

    {/* Error Message */}
    {error && (
      <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-700">
        {error}
      </div>
    )}

    {/* Form */}
    <div className="space-y-4">

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />

    </div>

    {/* Register Button */}
    <button
      onClick={handleRegister}
      className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-medium transition"
    >
      Create Account
    </button>

    {/* Login Link */}
    <p className="text-center text-sm text-gray-600 mt-5">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
      >
        Login
      </Link>
    </p>

  </div>

</div>

    )
}




export default Register;