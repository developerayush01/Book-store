import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";

function EditBook() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [editFormData, setEditFormData] = useState({
        title: "", author: "", price: "", condition: "", description: ""
    });
    const [imageSlots, setImageSlots] = useState([null, null, null, null, null]);
    const [newImages, setNewImages] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);

    useEffect(() => {
        if (!user) { navigate("/login"); return; }
        fetchBookDetails();
    }, [bookId, user, navigate]);

    const fetchBookDetails = async () => {
        try {
            const response = await axiosInstance.get(`/api/books/${bookId}`);
            const book = response.data;
            setEditFormData({
                title: book.title || "", author: book.author || "",
                price: book.price || "", condition: book.condition || "",
                description: book.description || ""
            });
            if (book.coverImage) setCoverImagePreview(book.coverImage);
            if (book.BookImages) {
                const slots = [null, null, null, null, null];
                book.BookImages.forEach(img => { if (img.order <= 5) slots[img.order - 1] = img; });
                setImageSlots(slots);
            }
        } catch (error) {
            setError("Could not load book details");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleCoverImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { setError("Cover image too large. Maximum 5MB"); return; }
        setCoverImage(file);
        setCoverImagePreview(URL.createObjectURL(file));
        setError("");
    };

    const handleDeleteCoverImage = async () => {
        try {
            await axiosInstance.delete(`/api/books/delete-cover/${bookId}`);
            setCoverImagePreview(null);
        } catch (error) {
            alert("Could not delete cover image");
        }
    };

    const handleImageSelectForSlot = (slotIndex) => (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { setError("File too large. Maximum 5MB"); return; }
        setNewImages({ ...newImages, [slotIndex]: file });
        setError("");
    };

    const handleDeleteExistingImage = async (slotIndex) => {
        try {
            const image = imageSlots[slotIndex];
            if (!image || !image.id) return;
            await axiosInstance.delete(`/api/books/delete-image/${image.id}`);
            const newSlots = [...imageSlots];
            newSlots[slotIndex] = null;
            setImageSlots(newSlots);
        } catch (error) {
            alert("Could not delete image");
        }
    };

    const handleDeleteNewImage = (slotIndex) => {
        const updated = { ...newImages };
        delete updated[slotIndex];
        setNewImages(updated);
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            setError("");

            await axiosInstance.put(`/api/books/edit-book/${bookId}`, editFormData);

            if (coverImage) {
                const formData = new FormData();
                formData.append("coverImage", coverImage);
                formData.append("book_id", bookId);
                await axiosInstance.post("/api/books/upload-cover", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            for (const slotIndex in newImages) {
                const file = newImages[slotIndex];
                const slot = parseInt(slotIndex) + 1;
                const formData = new FormData();
                formData.append("bookImages", file);
                formData.append("book_id", bookId);
                formData.append("slot", slot);
                await axiosInstance.post("/api/books/upload-images", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            navigate("/my-books");
        } catch (error) {
            setError(error.response?.data?.message || "Could not update book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F3EC] py-10 px-4 pb-24">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">

                <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Book</h2>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                {/* BASIC DETAILS */}
                <div className="flex flex-col gap-3">
                    {[
                        { name: "title", placeholder: "Book Title", type: "text" },
                        { name: "author", placeholder: "Author", type: "text" },
                        { name: "price", placeholder: "Price (Rs)", type: "number" },
                        { name: "condition", placeholder: "Condition", type: "text" },
                    ].map(field => (
                        <input
                            key={field.name}
                            type={field.type}
                            name={field.name}
                            value={editFormData[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-700"
                        />
                    ))}
                    <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-700 min-h-24"
                    />
                </div>

                {/* COVER */}
                <div className="mt-6 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-slate-800">Cover Image</h3>
                    {coverImagePreview ? (
                        <div className="mb-3">
                            <img src={coverImagePreview} alt="Cover" className="w-32 h-44 object-cover rounded-lg border" />
                            <button onClick={handleDeleteCoverImage} className="mt-2 text-xs text-red-500 hover:underline block">
                                Remove Cover
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 mb-2">No cover image</p>
                    )}
                    <label className="cursor-pointer text-sm text-amber-700 hover:underline">
                        {coverImagePreview ? "Change Cover" : "Select Cover Image"}
                        <input type="file" accept="image/*" onChange={handleCoverImageSelect} className="hidden" />
                    </label>
                </div>

                {/* GALLERY */}
                <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-slate-800">Book Images</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {imageSlots.map((image, slotIndex) => (
                            <div key={slotIndex} className="relative aspect-3/4 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                {image ? (
                                    <>
                                        <img src={image.image_url} alt="" className="w-full h-full object-cover" />
                                        <button onClick={() => handleDeleteExistingImage(slotIndex)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">✕</button>
                                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded">Slot {slotIndex + 1}</span>
                                    </>
                                ) : newImages[slotIndex] ? (
                                    <>
                                        <img src={URL.createObjectURL(newImages[slotIndex])} alt="" className="w-full h-full object-cover" />
                                        <button onClick={() => handleDeleteNewImage(slotIndex)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center">✕</button>
                                        <span className="absolute bottom-1 left-1 text-[10px] bg-amber-700 text-white px-1 rounded">NEW</span>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center justify-center h-full cursor-pointer text-gray-400">
                                        <span className="text-2xl">+</span>
                                        <span className="text-xs">Slot {slotIndex + 1}</span>
                                        <input type="file" accept="image/*" onChange={handleImageSelectForSlot(slotIndex)} className="hidden" />
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-8 flex flex-col gap-3">
                    <button
                        onClick={handleUpdate}
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
                    <button onClick={() => navigate("/my-books")} className="w-full py-2.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition">
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
}

export default EditBook;