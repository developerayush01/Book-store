import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from "react-router-dom";

function EditBook() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [editFormData, setEditFormData] = useState({
        title: "",
        author: "",
        price: "",
        condition: "",
        description: ""
    });
    
    // 5 image slots
    const [imageSlots, setImageSlots] = useState([null, null, null, null, null]);
    const [newImages, setNewImages] = useState({});  // {slotIndex: file}
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [coverImage, setCoverImage] = useState(null);
const [coverImagePreview, setCoverImagePreview] = useState(null);

    // ========== FETCH BOOK DETAILS ==========
    useEffect(() => {
        if(!user) {
            navigate("/login");
            return;
        }
        
        fetchBookDetails();
    }, [bookId, user, navigate]);

    const fetchBookDetails = async() => {
        try {
            const response = await axiosInstance.get(`/api/books/${bookId}`);
            const book = response.data;

            
            setEditFormData({
                title: book.title || "",
                author: book.author || "",
                price: book.price || "",
                condition: book.condition || "",
                description: book.description || ""
            });
            if(book.coverImage) {
    setCoverImagePreview(book.coverImage);
}
            // Fill image slots from existing images
            if(book.BookImages) {
                const slots = [null, null, null, null, null];
                book.BookImages.forEach(img => {
                    if(img.order <= 5) {
                        slots[img.order - 1] = img;  // order is 1-5, array is 0-4
                    }
                });
                setImageSlots(slots);
            }

            
        } catch(error) {
            setError("Could not load book details");
        }
    };

    // ========== HANDLE FORM INPUT ==========
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    // ========== HANDLE IMAGE SELECT FOR EMPTY SLOT ==========
    const handleImageSelectForSlot = (slotIndex) => (e) => {
        const file = e.target.files[0];
        
        if(!file) return;
        
        const maxSize = 5 * 1024 * 1024;
        if(file.size > maxSize) {
            setError("File too large. Maximum 5MB");
            return;
        }
        
        // Update newImages object
        setNewImages({
            ...newImages,
            [slotIndex]: file
        });
        
        setError("");
    };

    const handleCoverImageSelect = (e) => {
    const file = e.target.files[0];
    
    if(!file) return;
    
    const maxSize = 5 * 1024 * 1024;
    if(file.size > maxSize) {
        setError("Cover image too large. Maximum 5MB");
        return;
    }
    
    setCoverImage(file);
    
    const preview = URL.createObjectURL(file);
    setCoverImagePreview(preview);
    
    setError("");
};

const handleDeleteCoverImage = async() => {
    try {
        await axiosInstance.delete(`/api/books/delete-cover/${bookId}`);
        setCoverImagePreview(null);
    } catch(error) {
        alert("Could not delete cover image");
    }
};

    // ========== DELETE EXISTING IMAGE ==========
    const handleDeleteExistingImage = async(slotIndex) => {
        try {
            const image = imageSlots[slotIndex];
            
            if(!image || !image.id) return;
            
            // Delete from backend
            await axiosInstance.delete(`/api/books/delete-image/${image.id}`);
            
            // Clear slot
            const newSlots = [...imageSlots];
            newSlots[slotIndex] = null;
            setImageSlots(newSlots);
        } catch(error) {
            alert("Could not delete image");
        }
    };

    // ========== DELETE NEW IMAGE (before save) ==========
    const handleDeleteNewImage = (slotIndex) => {
        const updated = {...newImages};
        delete updated[slotIndex];
        setNewImages(updated);
    };

    // ========== UPDATE BOOK ==========
    const handleUpdate = async() => {
        try {
            setLoading(true);
            setError("");
            
            // STEP 1: Update book details
            await axiosInstance.put(
                `/api/books/edit-book/${bookId}`,
                editFormData
            );
            
            console.log("Book updated");
            
            if(coverImage) {
    const formData = new FormData();
    formData.append("coverImage", coverImage);
    formData.append("book_id", bookId);
    
    await axiosInstance.post(
        "/api/books/upload-cover",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" }
        }
    );
    
    console.log("Cover uploaded");
}

            // STEP 2: Upload new images to their slots
            for(const slotIndex in newImages) {
                const file = newImages[slotIndex];
                const slot = parseInt(slotIndex) + 1;  // 1-5
                 console.log(`Uploading slot ${slot}:`, file.name);
    console.log("Slot value:", slot);
    console.log("BookId:", bookId);

                const formData = new FormData();
                formData.append("bookImages", file);
                formData.append("book_id", bookId);
                formData.append("slot", slot);
                // Check FormData has the file
    console.log("FormData has file?", formData.has("bookImages"));
    console.log("FormData keys:", Array.from(formData.keys()));

                await axiosInstance.post(
                    "/api/books/upload-images",
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" }
                    }
                );
                
                console.log(`Image for slot ${slot} uploaded`);
            }
            
            alert("Book updated successfully!");
            navigate("/my-books");
            
        } catch(error) {
            setError(error.response?.data?.message || "Could not update book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: "600px", margin: "0 auto", padding: "20px"}}>
            <h2>Edit Book</h2>
            
            {error && <div style={{color: "red", marginBottom: "10px"}}>{error}</div>}
            
            {/* ========== FORM INPUTS ========== */}
            <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleInputChange}
                placeholder="Book Title"
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px"}}
            />
            
            <input
                type="text"
                name="author"
                value={editFormData.author}
                onChange={handleInputChange}
                placeholder="Author"
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px"}}
            />
            
            <input
                type="number"
                name="price"
                value={editFormData.price}
                onChange={handleInputChange}
                placeholder="Price"
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px"}}
            />
            
            <input
                type="text"
                name="condition"
                value={editFormData.condition}
                onChange={handleInputChange}
                placeholder="Condition"
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px"}}
            />
            
            <textarea
                name="description"
                value={editFormData.description}
                onChange={handleInputChange}
                placeholder="Description"
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "20px", minHeight: "100px"}}
            />
            
            <div style={{marginBottom: "20px", padding: "15px", border: "2px solid #007bff", borderRadius: "5px"}}>
    <h3>Cover Image</h3>
    
    {coverImagePreview ? (
        <>
            <img
                src={coverImagePreview}
                alt="Cover"
                style={{
                    width: "150px",
                    height: "200px",
                    objectFit: "cover",
                    marginBottom: "10px",
                    borderRadius: "5px"
                }}
            />
            
            <div>
                <button
                    onClick={handleDeleteCoverImage}
                    style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginRight: "10px"
                    }}
                >
                    Delete Cover
                </button>
            </div>
        </>
    ) : (
        <p style={{color: "#666"}}>No cover image</p>
    )}
    
    <label style={{display: "block", marginTop: "10px"}}>
        <strong>Upload/Replace Cover:</strong>
    </label>
    <input
        type="file"
        accept="image/*"
        onChange={handleCoverImageSelect}
        style={{marginTop: "5px"}}
    />
</div>
            {/* ========== 5 IMAGE SLOTS ========== */}
            <h3>Book Images (5 Slots)</h3>
            <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "15px", marginBottom: "20px"}}>
                {imageSlots.map((image, slotIndex) => (
                    <div
                        key={slotIndex}
                        style={{
                            border: "2px solid #ddd",
                            borderRadius: "5px",
                            aspectRatio: "3/4",
                            position: "relative",
                            overflow: "hidden"
                        }}
                    >
                        {image ? (
                            // EXISTING IMAGE
                            <>
                                <img
                                    src={image.image_url}
                                    alt={`Slot ${slotIndex + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />
                                
                                {/* Delete button */}
                                <button
                                    onClick={() => handleDeleteExistingImage(slotIndex)}
                                    style={{
                                        position: "absolute",
                                        top: "5px",
                                        right: "5px",
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "30px",
                                        height: "30px",
                                        cursor: "pointer",
                                        fontSize: "16px"
                                    }}
                                >
                                    ✕
                                </button>
                                
                                {/* Slot number */}
                                <div style={{
                                    position: "absolute",
                                    bottom: "5px",
                                    left: "5px",
                                    background: "rgba(0,0,0,0.5)",
                                    color: "white",
                                    padding: "2px 8px",
                                    borderRadius: "3px",
                                    fontSize: "12px"
                                }}>
                                    Slot {slotIndex + 1}
                                </div>
                            </>
                        ) : newImages[slotIndex] ? (
                            // NEW IMAGE PREVIEW
                            <>
                                <img
                                    src={URL.createObjectURL(newImages[slotIndex])}
                                    alt={`New Slot ${slotIndex + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />
                                
                                {/* Delete new image */}
                                <button
                                    onClick={() => handleDeleteNewImage(slotIndex)}
                                    style={{
                                        position: "absolute",
                                        top: "5px",
                                        right: "5px",
                                        background: "orange",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "30px",
                                        height: "30px",
                                        cursor: "pointer",
                                        fontSize: "16px"
                                    }}
                                >
                                    ✕
                                </button>
                                
                                {/* New label */}
                                <div style={{
                                    position: "absolute",
                                    bottom: "5px",
                                    left: "5px",
                                    background: "rgba(255,165,0,0.8)",
                                    color: "white",
                                    padding: "2px 8px",
                                    borderRadius: "3px",
                                    fontSize: "12px"
                                }}>
                                    NEW
                                </div>
                            </>
                        ) : (
                            // EMPTY SLOT - UPLOAD
                            <label style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                                cursor: "pointer",
                                background: "#f5f5f5",
                                color: "#666"
                            }}>
                                <span style={{fontSize: "24px", marginBottom: "5px"}}>+</span>
                                <span style={{fontSize: "12px", textAlign: "center"}}>Slot {slotIndex + 1}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelectForSlot(slotIndex)}
                                    style={{display: "none"}}
                                />
                            </label>
                        )}
                    </div>
                ))}
            </div>
            
            {/* ========== BUTTONS ========== */}
            <button
                onClick={handleUpdate}
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px",
                    background: loading ? "#ccc" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: loading ? "not-allowed" : "pointer"
                }}
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>
            
            <button
                onClick={() => navigate("/my-books")}
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

export default EditBook;