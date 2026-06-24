import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../api/axios";

function Verification() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async () => {
    try {
      await axiosInstance.post("/api/users/verify-otp", { email, otp });
      navigate("/login", { state: location.state });
    } catch (error) {
      setError(error.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await axiosInstance.post("/api/users/resend-otp", { email });
      setMessage("OTP resent successfully");
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-sm p-6">

        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
          Verify Email
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold">{email}</span>
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}
        {message && (
          <p className="text-green-500 text-sm text-center mb-3">{message}</p>
        )}

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          className="w-full border p-2 rounded text-sm text-center tracking-widest"
        />

        <button
          onClick={handleVerify}
          className="w-full mt-4 bg-slate-800 text-white py-2 rounded text-sm hover:bg-slate-700 transition"
        >
          Verify
        </button>

        <button
          onClick={handleResend}
          className="w-full mt-2 border border-slate-800 text-slate-800 py-2 rounded text-sm hover:bg-slate-100 transition"
        >
          Resend OTP
        </button>

      </div>
    </div>
  );
}

export default Verification;