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
        <div style={{maxWidth: "500px", margin: "0 auto", padding: "20px"}}>
            <h2>Edit Profile</h2>
            
            
            {error && (
                <div style={{color: "red", marginBottom: "10px"}}>
                    {error}
                </div>
            )}
            
            
            <div style={{marginBottom: "20px", textAlign: "center"}}>
                <h4>Profile Picture</h4>
                
                
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Profile"
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginBottom: "15px"
                        }}
                    />
                ) : (
                    <div style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        background: "#e9ecef",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "60px",
                        margin: "0 auto 15px",
                        color: "#6c757d"
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                
                {/* File input */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{marginBottom: "10px"}}
                />
            </div>
            
            {/* ========== FORM INPUTS ========== */}
            <input 
                value={editFormData.name}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                placeholder="Name"
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px"}}
            />
            
            <input 
                value={editFormData.email}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                placeholder="Email"
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px"}}
            />
            
            <input 
                value={editFormData.phone}
                onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                placeholder="Phone"
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px"}}
            />
            
            {/* ========== BUTTONS ========== */}
            <button 
                onClick={handleUpdateProfile}
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "10px",
                    background: loading ? "#ccc" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    marginBottom: "10px",
                    cursor: loading ? "not-allowed" : "pointer"
                }}
            >
                {loading ? "Saving..." : "Save"}
            </button>
            
            <button 
                onClick={() => navigate(-1)}
                style={{
                    width: "100%",
                    padding: "10px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Cancel
            </button>
        </div>
    );
}

export default EditProfile;