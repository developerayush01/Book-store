import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

function EditProfile() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [editFormData, setEditFormData] = useState({ name: "", phone: "", email: "" });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!user) return <p>Please login first</p>;

    useEffect(() => {
        setEditFormData({ name: user.name, email: user.email, phone: user.phone });
        if (user.profilePicture) setImagePreview(user.profilePicture);
    }, [user]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setError("");
    };

    const handleUpdateProfile = async () => {
        try {
            setLoading(true);
            setError("");

            await axiosInstance.put("/api/users/profile/edit-profile", editFormData);

            if (selectedImage) {
                const formData = new FormData();
                formData.append("profilePicture", selectedImage);
                await axiosInstance.post("/api/users/upload-profile-picture", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            const userRes = await axiosInstance.get("/api/users/profile");
            setUser(userRes.data.user);
            navigate("/profile");
        } catch (error) {
            setError(error.response?.data?.message || "Could not update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center px-4 py-10">
            <div className="bg-white w-full max-w-md rounded-lg shadow-sm p-6">

                <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Edit Profile</h2>

                {error && (
                    <div className="text-red-500 text-sm mb-4 text-center bg-red-50 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                {/* PROFILE IMAGE */}
                <div className="text-center mb-6">
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover mx-auto mb-3 border-4 border-amber-700"
                        />
                    ) : (
                        <div className="w-28 h-28 rounded-full bg-slate-800 flex items-center justify-center text-4xl font-bold text-white mx-auto mb-3">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <label className="cursor-pointer text-sm text-amber-700 hover:underline">
                        Change Photo
                        <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </label>
                </div>

                {/* INPUTS */}
                <div className="flex flex-col gap-3">
                    <input
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        placeholder="Name"
                        className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-700"
                    />
                    <input
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        placeholder="Email"
                        className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-700"
                    />
                </div>

                {/* BUTTONS */}
                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg text-white text-sm bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Spinner />
                                Saving...
                            </span>
                        ) : "Save Changes"}
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        className="w-full py-2.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
}

export default EditProfile;