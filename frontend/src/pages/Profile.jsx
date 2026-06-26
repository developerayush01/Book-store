import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

function Profile() {
    const { user,setUser } = useAuth();
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    if (!user) return <p>Please login first</p>;

    useEffect(() => {
        if (user.profilePicture) {
            setImagePreview(user.profilePicture);
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await axiosInstance.post("api/users/logout");
            setUser("");
            navigate("/");
        } catch (error) {
            alert("Logout failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4 py-10">
            <div className="bg-white w-full max-w-md rounded-lg shadow-sm p-6 text-center">

                {/* AVATAR */}
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-amber-700"
                    />
                ) : (
                    <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                )}

                {/* NAME */}
                <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>

                {/* INFO */}
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}

                {/* DIVIDER */}
                <div className="border-t my-5" />

                {/* ACTIONS */}
                <div className="flex flex-col gap-3">
    <button
        onClick={() => navigate("/profile/edit")}
        className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg transition text-sm font-medium"
    >
        Edit Profile
    </button>

    <button
        onClick={() => navigate("/profile/edit/change-password")}
        className="w-full border border-slate-800 text-slate-800 py-2.5 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
    >
        Change Password
    </button>

    <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg transition text-sm font-medium"
    >
        Logout
    </button>
</div>

            </div>
        </div>
    );
}

export default Profile;