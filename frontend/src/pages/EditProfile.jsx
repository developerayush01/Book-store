import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useNavigate,useLocation} from "react-router-dom";
import axios from 'axios';

function EditProfile(){
    const { user, setUser } = useAuth();
    const navigate=useNavigate();
    const [editFormData,setEditFormData]=useState({
        name:"",
        phone:"",
        email:"",
        password:""
    });
    const [EditProfile,setEditProfile]=useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview,setimagePreview]=useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if(!user) {
    return <p>Please login first</p>;
}

useEffect(() => {
    handleEditClick();
}, [user]);

const handleEditClick = () => {
    setEditFormData({
        name: user.name,
        email: user.email,
        phone: user.phone
    });
    
    if(user.profilePicture){
        setimagePreview(user.profilePicture);
    }
};

const handleImageSelect=(e)=>{
    const file=e.target.files[0];

    if(!file){
        return;
    }

setSelectedImage(file);


const preview=URL.createObjectURL(file);
setimagePreview(preview);
setError("");

}

const handleUpdateProfile=async()=>{
    try {

        setLoading(true);
        setError("");

        await axiosInstance.put("/api/users/profile/edit-profile",editFormData);

        if(selectedImage){
            const formData=new FormData();
            formData.append("profilePicture",selectedImage);

            await axiosInstance.post(
                "/api/users/upload-profile-picture",
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" }
                    }
            )
        }

        const userRes = await axiosInstance.get("/api/users/profile");
            setUser(userRes.data.user);
            
            alert("Profile updated successfully!");
            navigate("/profile");
    } catch (error) {
        setError(error.response?.data?.message || "Could not update profile");
        } finally {
            setLoading(false);
        }
};

return (
        <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4">

  <div className="bg-white w-full max-w-md rounded-lg shadow-sm p-6">

    {/* TITLE */}
    <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">
      Edit Profile
    </h2>

    {/* ERROR */}
    {error && (
      <div className="text-red-500 text-sm mb-3 text-center">
        {error}
      </div>
    )}

    {/* ========== PROFILE IMAGE ========== */}
    <div className="text-center mb-6">

      <h4 className="text-sm font-semibold mb-3 text-gray-600">
        Profile Picture
      </h4>

      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover mx-auto mb-3"
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 mx-auto mb-3">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="text-sm"
      />

    </div>

    {/* ========== INPUTS ========== */}
    <div className="flex flex-col gap-3">

      <input
        value={editFormData.name}
        onChange={(e) =>
          setEditFormData({ ...editFormData, name: e.target.value })
        }
        placeholder="Name"
        className="border p-2 rounded text-sm"
      />

      <input
        value={editFormData.email}
        onChange={(e) =>
          setEditFormData({ ...editFormData, email: e.target.value })
        }
        placeholder="Email"
        className="border p-2 rounded text-sm"
      />

      <input
        value={editFormData.phone}
        onChange={(e) =>
          setEditFormData({ ...editFormData, phone: e.target.value })
        }
        placeholder="Phone"
        className="border p-2 rounded text-sm"
      />

    </div>

    {/* ========== BUTTONS ========== */}
    <div className="mt-6 flex flex-col gap-3">

      <button
        onClick={handleUpdateProfile}
        disabled={loading}
        className={`w-full py-2 rounded text-white text-sm ${
          loading ? "bg-gray-400" : "bg-slate-800 hover:bg-slate-700"
        }`}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      <button
        onClick={() => navigate(-1)}
        className="w-full py-2 rounded border text-sm"
      >
        Cancel
      </button>

    </div>

  </div>
</div>
    );
}

export default EditProfile;