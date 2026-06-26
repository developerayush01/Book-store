import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axios";
import Spinner from "../components/Spinner";

function Verification() {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleVerify = async () => {
        try {
            setVerifying(true);
            await axiosInstance.post("/api/users/verify-otp", { email, otp });
            navigate("/login", { state: location.state });
        } catch (error) {
            setError(error.response?.data?.message || "Verification failed");
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        try {
            setResending(true);
            await axiosInstance.post("/api/users/resend-otp", { email });
            setMessage("OTP resent successfully");
            setError("");
            setTimeLeft(600);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to resend OTP");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-sm rounded-lg shadow-sm p-6">

                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">Verify Email</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Code sent to <span className="font-semibold text-slate-800">{email}</span>
                    </p>
                </div>

                <p className={`text-center text-sm font-semibold mb-4 ${timeLeft <= 60 ? "text-red-500" : "text-amber-700"}`}>
                    {timeLeft > 0 ? `OTP expires in ${formatTime(timeLeft)}` : "OTP expired"}
                </p>

                {error && <div className="mb-3 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg text-center">{error}</div>}
                {message && <div className="mb-3 bg-green-50 border border-green-200 text-green-600 text-sm px-3 py-2 rounded-lg text-center">{message}</div>}

                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-sm text-center tracking-widest focus:outline-none focus:border-amber-700"
                />

                <button
                    onClick={handleVerify}
                    disabled={verifying || timeLeft <= 0}
                    className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg text-sm transition disabled:opacity-50"
                >
                    {verifying ? (
                        <span className="flex items-center justify-center gap-2">
                            <Spinner />
                            Verifying...
                        </span>
                    ) : "Verify"}
                </button>

                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="w-full mt-2 border border-slate-800 text-slate-800 py-2.5 rounded-lg text-sm hover:bg-slate-50 transition disabled:opacity-50"
                >
                    {resending ? (
                        <span className="flex items-center justify-center gap-2">
                            <Spinner dark />
                            Resending...
                        </span>
                    ) : "Resend OTP"}
                </button>

            </div>
        </div>
    );
}

export default Verification;