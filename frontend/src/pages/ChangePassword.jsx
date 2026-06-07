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
        <div>
            <p>Change Password</p>
            <input 
            type="password"
                value={passwordFormData.oldPassword}
                onChange={(e) => setpasswordFormData({...passwordFormData, oldPassword: e.target.value})}
                placeholder="Old Password"
            />
            <input 
            type="password"
                value={passwordFormData.newPassword}
                onChange={(e) => setpasswordFormData({...passwordFormData, newPassword: e.target.value})}
                placeholder="New Password"
            />
            <input 
            type="password"
                value={passwordFormData.confirmPassword}
                onChange={(e) => setpasswordFormData({...passwordFormData, confirmPassword: e.target.value})}
                placeholder="Confirm Password"
            />
            <button onClick={handleChangePassword}>Save</button>
            <button onClick={()=>navigate(-1)}>Cancel</button>
        </div>
    );

}
export default ChangePassword;