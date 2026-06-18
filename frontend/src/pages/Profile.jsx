import {Link} from 'react-router-dom';
import { useState, useEffect } from "react";
import {useAuth} from '../context/AuthContext';
import { useNavigate} from "react-router-dom";

function Profile() {
    const {user}=useAuth();
    const [imagePreview,setimagePreview]=useState(null);
    const navigate = useNavigate();

    if(!user) {
    return <p>Please login first</p>;
}

useEffect(()=>{
if(user.profilePicture){
        setimagePreview(user.profilePicture);
    }
},[user]);


    return (
            <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4">

  <div className="bg-white w-full max-w-md rounded-lg shadow-sm p-6 text-center">

    {/* AVATAR */}
    {imagePreview ? (
      <img
        src={imagePreview}
        alt="Profile"
        className="w-28 h-28 rounded-full object-cover mx-auto mb-4"
      />
    ) : (
      <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 mx-auto mb-4">
        {user?.name?.charAt(0).toUpperCase()}
      </div>
    )}

    {/* NAME */}
    <h2 className="text-xl font-bold text-slate-800">
      {user.name}
    </h2>

    {/* INFO */}
    <p className="text-sm text-gray-500 mt-1">
      {user.email}
    </p>

    <p className="text-sm text-gray-500">
      {user.phone}
    </p>

    {/* ACTIONS */}
    <div className="mt-6 flex flex-col gap-2">

      <button
        onClick={() => navigate("/profile/edit")}
        className="w-full bg-slate-800 text-white py-2 rounded hover:bg-slate-700 transition"
      >
        Edit Profile
      </button>

      <button
        onClick={() => navigate("/profile/edit/change-password")}
        className="w-full border border-slate-800 text-slate-800 py-2 rounded hover:bg-slate-100 transition"
      >
        Change Password
      </button>

      <Link
        to="/my-books"
        className="text-sm text-blue-600 mt-2 hover:underline"
      >
        View Listed Books →
      </Link>

    </div>

  </div>

</div>
    );
}

export default Profile;