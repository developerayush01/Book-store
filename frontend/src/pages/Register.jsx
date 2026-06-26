import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import axiosInstance from '../api/axios';
import Spinner from "../components/Spinner";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState("");

    const redirectState = location.state;

    const handleRegister = async () => {
        if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
            setError("All fields are required");
            return;
        }
        try {
            setLoading(true);
            await axiosInstance.post("/api/users/register", { name, email, password });
            navigate("/verify", { state: { ...location.state, email } });
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Create Account</h2>
                    <p className="text-gray-500 text-sm mt-1">Join Nepal's secondhand book marketplace</p>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-700"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-700"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-700"
                    />
                </div>

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full mt-6 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Spinner />
                            Creating Account...
                        </span>
                    ) : "Create Account"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-5">
                    Already have an account?{" "}
                    <Link to="/login" state={redirectState} className="text-amber-700 font-medium hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;