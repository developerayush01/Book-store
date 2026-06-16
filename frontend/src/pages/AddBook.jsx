import { useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AddBook() {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [bookFormData, setBookFormData] = useState({
        title: "",
        author: "",
        price: "",
        condition: "",
        description: ""
    });
    
    // 5 image slots
    const [imageSlots, setImageSlots] = useState([null, null, null, null, null]);
    const [coverImage, setCoverImage] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ========== HANDLE FORM INPUT ==========
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookFormData({
            ...bookFormData,
            [name]: value
        });
    };

    // ========== HANDLE COVER IMAGE SELECTION ==========
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

    // ========== DELETE COVER IMAGE ==========
    const handleDeleteCoverImage = () => {
        setCoverImage(null);
        setCoverImagePreview(null);
    };

    // ========== HANDLE IMAGE SELECT FOR SLOT ==========
    const handleImageSelectForSlot = (slotIndex) => (e) => {
        const file = e.target.files[0];
        
        if(!file) return;
        
        const maxSize = 5 * 1024 * 1024;
        if(file.size > maxSize) {
            setError("File too large. Maximum 5MB");
            return;
        }
        
        const newSlots = [...imageSlots];
        newSlots[slotIndex] = file;
        setImageSlots(newSlots);
        
        setError("");
    };

    // ========== DELETE IMAGE FROM SLOT ==========
    const handleDeleteImage = (slotIndex) => {
        const newSlots = [...imageSlots];
        newSlots[slotIndex] = null;
        setImageSlots(newSlots);
    };

    // ========== ADD BOOK WITH IMAGES ==========
    const handleAddBook = async() => {
        try {
            setLoading(true);
            setError("");
            
            // Validate form
            if(!bookFormData.title || !bookFormData.author || !bookFormData.price) {
                setError("Please fill all required fields");
                setLoading(false);
                return;
            }
            
            // Check at least one image is selected
            const hasImages = imageSlots.some(slot => slot !== null);
            if(!hasImages) {
                setError("Please select at least one image");
                setLoading(false);
                return;
            }
            
            // ========== STEP 1: CREATE BOOK ==========
            const bookRes = await axiosInstance.post("/api/books/add-book", bookFormData);
            const bookId = bookRes.data.book.id;
            
            console.log("Book created:", bookId);
            
            // ========== STEP 2: UPLOAD COVER IMAGE (if selected) ==========
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
            
            // ========== STEP 3: UPLOAD DETAIL IMAGES TO SLOTS ==========
            for(let slotIndex = 0; slotIndex < imageSlots.length; slotIndex++) {
                const file = imageSlots[slotIndex];
                
                if(!file) continue;  // Skip empty slots
                
                const slot = slotIndex + 1;  // 1-5
                
                const formData = new FormData();
                formData.append("bookImages", file);
                formData.append("book_id", bookId);
                formData.append("slot", slot);
                
                await axiosInstance.post(
                    "/api/books/upload-images",
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" }
                    }
                );
                
                console.log(`Image for slot ${slot} uploaded`);
            }
            
            alert("Book added successfully!");
            navigate("/my-books");
            
        } catch(error) {
            console.log("Error:", error);
            setError(error.response?.data?.message || "Could not add book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: "600px", margin: "0 auto", padding: "20px"}}>
            <h2>Add New Book</h2>
            
            {error && <div style={{color: "red", marginBottom: "10px"}}>{error}</div>}
            
            {/* FORM INPUTS */}
            <input
                type="text"
                name="title"
                placeholder="Book Title"
                value={bookFormData.title}
                onChange={handleInputChange}
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px"}}
            />
            
            <input
                type="text"
                name="author"
                placeholder="Author"
                value={bookFormData.author}
                onChange={handleInputChange}
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px"}}
            />
            
            <input
                type="number"
                name="price"
                placeholder="Price (Rs)"
                value={bookFormData.price}
                onChange={handleInputChange}
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px"}}
            />
            
            <input
                type="text"
                name="condition"
                placeholder="Condition (e.g., New, Like New, Good)"
                value={bookFormData.condition}
                onChange={handleInputChange}
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px"}}
            />
            
            <textarea
                name="description"
                placeholder="Description"
                value={bookFormData.description}
                onChange={handleInputChange}
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "20px", minHeight: "100px"}}
            />
            
            {/* ========== COVER IMAGE SECTION ========== */}
            <div style={{marginBottom: "20px", padding: "15px", border: "2px solid #007bff", borderRadius: "5px"}}>
                <h3>Cover Image (Optional)</h3>
                
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
                    <p style={{color: "#666"}}>No cover image selected</p>
                )}
                
                <label style={{display: "block", marginTop: "10px"}}>
                    <strong>Upload Cover:</strong>
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageSelect}
                    style={{marginTop: "5px"}}
                />
            </div>
            
            {/* ========== 5 IMAGE SLOTS ========== */}
            <h3>Book Images (5 Slots - Select at least 1)</h3>
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
                            // IMAGE SELECTED
                            <>
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Slot ${slotIndex + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                    }}
                                />
                                
                                {/* Delete button */}
                                <button
                                    onClick={() => handleDeleteImage(slotIndex)}
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
            
            {/* BUTTONS */}
            <button
                onClick={handleAddBook}
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "12px",
                    background: loading ? "#ccc" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    marginBottom: "10px",
                    cursor: loading ? "not-allowed" : "pointer"
                }}
            >
                {loading ? "Adding Book..." : "Add Book"}
            </button>
            
            <button
                onClick={() => navigate("/")}
                style={{
                    width: "100%",
                    padding: "12px",
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    cursor: "pointer"
                }}
            >
                Cancel
            </button>
        </div>
    );
}

export default AddBook;