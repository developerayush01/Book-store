import { useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

function AddBook() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [bookFormData, setBookFormData] = useState({
        title: "", author: "", price: "", condition: "", description: ""
    });
    const [imageSlots, setImageSlots] = useState([null, null, null, null, null]);
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookFormData({ ...bookFormData, [name]: value });
    };

    const handleCoverImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { setError("Cover image too large. Maximum 5MB"); return; }
        setCoverImage(file);
        setCoverImagePreview(URL.createObjectURL(file));
        setError("");
    };

    const handleDeleteCoverImage = () => {
        setCoverImage(null);
        setCoverImagePreview(null);
    };

    const handleImageSelectForSlot = (slotIndex) => (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { setError("File too large. Maximum 5MB"); return; }
        const newSlots = [...imageSlots];
        newSlots[slotIndex] = file;
        setImageSlots(newSlots);
        setError("");
    };

    const handleDeleteImage = (slotIndex) => {
        const newSlots = [...imageSlots];
        newSlots[slotIndex] = null;
        setImageSlots(newSlots);
    };

    const handleAddBook = async () => {
        try {
            setLoading(true);
            setError("");

            if (!bookFormData.title || !bookFormData.author || !bookFormData.price) {
                setError("Please fill all required fields");
                setLoading(false);
                return;
            }
            if (!coverImage) { setError("Please select a cover image"); setLoading(false); return; }
            if (!imageSlots.some(slot => slot !== null)) {
                setError("Please select at least one image");
                setLoading(false);
                return;
            }

            const bookRes = await axiosInstance.post("/api/books/add-book", bookFormData);
            const bookId = bookRes.data.book.id;

            const coverFormData = new FormData();
            coverFormData.append("coverImage", coverImage);
            coverFormData.append("book_id", bookId);
            await axiosInstance.post("/api/books/upload-cover", coverFormData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            for (let slotIndex = 0; slotIndex < imageSlots.length; slotIndex++) {
                const file = imageSlots[slotIndex];
                if (!file) continue;
                const formData = new FormData();
                formData.append("bookImages", file);
                formData.append("book_id", bookId);
                formData.append("slot", slotIndex + 1);
                await axiosInstance.post("/api/books/upload-images", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            navigate("/my-books");
        } catch (error) {
            setError(error.response?.data?.message || "Could not add book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7F3EC] py-10 px-4 pb-24">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">

                <h2 className="text-2xl font-bold mb-6 text-slate-800">Add New Book</h2>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                {/* BASIC INFO */}
                <div className="flex flex-col gap-3">
                    {[
                        { name: "title", placeholder: "Book Title", type: "text" },
                        { name: "author", placeholder: "Author", type: "text" },
                        { name: "price", placeholder: "Price (Rs)", type: "number" },
                        { name: "condition", placeholder: "Condition (New / Good / Like New)", type: "text" },
                    ].map(field => (
                        <input
                            key={field.name}
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={bookFormData[field.name]}
                            onChange={handleInputChange}
                            className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-700"
                        />
                    ))}
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={bookFormData.description}
                        onChange={handleInputChange}
                        className="border border-gray-200 p-2.5 rounded-lg text-sm focus:outline-none focus:border-amber-700 min-h-24"
                    />
                </div>

                {/* COVER IMAGE */}
                <div className="mt-6 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-slate-800">Cover Image</h3>
                    {coverImagePreview ? (
                        <div className="mb-3">
                            <img src={coverImagePreview} alt="Cover" className="w-32 h-44 object-cover rounded-lg border" />
                            <button onClick={handleDeleteCoverImage} className="mt-2 text-xs text-red-500 hover:underline">
                                Remove Cover
                            </button>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 mb-2">No cover selected</p>
                    )}
                    <label className="cursor-pointer text-sm text-amber-700 hover:underline">
                        {coverImagePreview ? "Change Cover" : "Select Cover Image"}
                        <input type="file" accept="image/*" onChange={handleCoverImageSelect} className="hidden" />
                    </label>
                </div>

                {/* IMAGE GRID */}
                <div className="mt-6">
                    <h3 className="font-semibold mb-3 text-slate-800">Book Images (5 slots)</h3>
                    <div className="grid grid-cols-5 gap-3">
                        {imageSlots.map((image, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg aspect-3/4 relative overflow-hidden bg-gray-50">
                                {image ? (
                                    <>
                                        <img src={URL.createObjectURL(image)} alt={`slot-${index}`} className="w-full h-full object-cover" />
                                        <button onClick={() => handleDeleteImage(index)} className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">✕</button>
                                        <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded">{index + 1}</span>
                                    </>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-400 text-xs">
                                        <span className="text-xl">+</span>
                                        <span>Slot {index + 1}</span>
                                        <input type="file" accept="image/*" onChange={handleImageSelectForSlot(index)} className="hidden" />
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={handleAddBook}
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg text-white text-sm bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Spinner />
                                Adding Book...
                            </span>
                        ) : "Add Book"}
                    </button>
                    <button onClick={() => navigate("/")} className="w-full py-2.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition">
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AddBook;