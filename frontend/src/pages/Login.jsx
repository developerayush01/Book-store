import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import Spinner from "../components/Spinner";
import Register from './Register';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();
    const [error, setError] = useState("");

    const redirectState = location.state;

    const handleLogin = async () => {
        try {
            setLoading(true);
            await axiosInstance.post("/api/users/login", { email, password });
            const profile = await axiosInstance.get("/api/users/profile");
            setUser(profile.data.user);

            if (redirectState?.action === "addToCart") {
                try {
                    await axiosInstance.post("/api/cart/add-cart", { book_id: redirectState.book_id });
                } catch (error) {
                    alert("Cannot add to cart");
                }
                navigate(redirectState.from || "/", { state: { cartSuccess: true } });
            } else if (redirectState?.action === "buyNow") {
                navigate(redirectState.from || "/", { state: { triggerBuyNow: true } });
            } else {
                navigate(redirectState?.from || "/");
            }
        } catch (error) {
            if (error.response?.status === 403) {
                navigate("/verify", { state: { ...redirectState, email } });
                return;
            }
            setError(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-sm rounded-lg shadow-sm p-6">

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                    <p className="text-gray-500 text-sm mt-1">Login to Books Deal</p>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-3">
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
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full mt-5 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg text-sm transition disabled:opacity-50"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Spinner />
                            Logging in...
                        </span>
                    ) : "Login"}
                </button>

                
                    <button
                    onClick={() => navigate("/register")}
                    disabled={loading}
                    className="w-full mt-5 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg text-sm transition disabled:opacity-50"
                >
                            Register
                </button>

            </div>
        </div>
    );
}

export default Login;