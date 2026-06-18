import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useNavigate,useLocation} from "react-router-dom";
import axios from 'axios';

function ChangePassword(){
    const {user}=useAuth();
    const navigate=useNavigate();
    const [password,setpassword]=useState(null);
    const [passwordFormData,setpasswordFormData]=useState({
        oldPassword:"",
        newPassword:"",
        confirmPassword:""
    });

    const handleChangePassword=async()=>{
        try {
            await axiosInstance.put("/api/users/profile/edit-profile/change-password",{
                oldPassword:passwordFormData.oldPassword,
                newPassword:passwordFormData.newPassword,
                confirmPassword:passwordFormData.confirmPassword
            });
            alert("Password changed successfully!");
            navigate("/profile");
        } catch (error) {
            alert("Could Not Change Password");
        }
    }


    return(
        <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4">

  <div className="bg-white w-full max-w-md rounded-lg shadow-sm p-6">

    {/* TITLE */}
    <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
      Change Password
    </h2>

    <p className="text-xs text-gray-500 text-center mb-6">
      Keep your account secure by using a strong password
    </p>

    {/* INPUTS */}
    <div className="flex flex-col gap-3">

      <input
        type="password"
        value={passwordFormData.oldPassword}
        onChange={(e) =>
          setpasswordFormData({
            ...passwordFormData,
            oldPassword: e.target.value
          })
        }
        placeholder="Current Password"
        className="border p-2 rounded text-sm"
      />

      <input
        type="password"
        value={passwordFormData.newPassword}
        onChange={(e) =>
          setpasswordFormData({
            ...passwordFormData,
            newPassword: e.target.value
          })
        }
        placeholder="New Password"
        className="border p-2 rounded text-sm"
      />

      <input
        type="password"
        value={passwordFormData.confirmPassword}
        onChange={(e) =>
          setpasswordFormData({
            ...passwordFormData,
            confirmPassword: e.target.value
          })
        }
        placeholder="Confirm New Password"
        className="border p-2 rounded text-sm"
      />

    </div>

    {/* ACTIONS */}
    <div className="mt-6 flex flex-col gap-3">

      <button
        onClick={handleChangePassword}
        className="w-full bg-slate-800 text-white py-2 rounded text-sm hover:bg-slate-700 transition"
      >
        Update Password
      </button>

      <button
        onClick={() => navigate(-1)}
        className="w-full border py-2 rounded text-sm"
      >
        Cancel
      </button>

    </div>

  </div>
</div>
    );

}
export default ChangePassword;