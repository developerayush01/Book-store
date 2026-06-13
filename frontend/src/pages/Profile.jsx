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
            <div>
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
        <div>{user.name}</div>
        <div>{user.phone}</div>
        <div>{user.email}</div>
        <button onClick={() => navigate("/profile/edit")}>Edit profile</button>
        <button onClick={() => navigate("/profile/edit/change-password")}>Change Password</button>
        <div><Link to="/my-books">Listed books</Link></div>
    </div>
    );
}

export default Profile;