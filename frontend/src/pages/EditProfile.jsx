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

const handleimageSelect=(e)=>{
    const file=e.target.files[0];

    if(!file){
        return;
    }
}

setSelectedImage(file);

const preview=URL.createObjectURL(file);
setimagePreview(preview);


const handleUpdateProfile=async()=>{
    try {
        await axiosInstance.put("/api/users/profile/edit-profile",editFormData);
        setUser({...user,...editFormData});
        alert("Profile updated!");
        navigate("/profile");
    } catch (error) {
        alert("Could not update profile");
    }
}

return (
        <div>
            <h2>Edit Profile</h2>
            
            <input 
                value={editFormData.name}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                placeholder="Name"
            />
            
            <input 
                value={editFormData.email}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                placeholder="Email"
            />
            
            <input 
                value={editFormData.phone}
                onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                placeholder="Phone"
            />
            
            <button onClick={handleUpdateProfile}>Save</button>
            <button onClick={() => navigate(-1)}>Cancel</button>
        </div>
    );
}

export default EditProfile;