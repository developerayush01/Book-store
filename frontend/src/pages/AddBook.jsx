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
    const [bookImages, setBookImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
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

    
    const handleImageSelect = (e) => {
    const newFiles = Array.from(e.target.files);
    const allFiles = [...selectedImages, ...newFiles];
    
    const totalImages = bookImages.length + allFiles.length;
    if(totalImages > 5) {
        setError(`Maximum 5 images allowed. You have ${bookImages.length} existing images.`);
        return;
    }
    
    setSelectedImages(allFiles);
    
    const previews = allFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    setError("");
};

    // ========== DELETE IMAGE ==========
    const handleDeleteImage = (index) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
        
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
        setImagePreviews(updatedPreviews);
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
            
            // At least one image recommended
            if(selectedImages.length === 0) {
                setError("Please select at least one image");
                setLoading(false);
                return;
            }
            
            // ========== STEP 1: CREATE BOOK ==========
            const bookRes = await axiosInstance.post("/api/books/add-book", bookFormData);
            const bookId = bookRes.data.id;
            
            console.log("Book created:", bookId);
            
            // ========== STEP 2: UPLOAD IMAGES ==========
            if(selectedImages.length > 0) {
                const formData = new FormData();
                
                selectedImages.forEach(image => {
                    formData.append("bookImages", image);
                });
                
                formData.append("book_id", bookId);
                
                await axiosInstance.post(
                    "/api/books/upload-images",
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" }
                    }
                );
                
                console.log("Images uploaded");
            }
            
            alert("Book added with images!");
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
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px", minHeight: "100px"}}
            />
            
            {/* IMAGE UPLOAD */}
            <label style={{display: "block", marginBottom: "10px"}}>
                <strong>Upload Book Images (max 5):</strong>
            </label>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                style={{display: "block", marginBottom: "15px"}}
            />
            
            {/* IMAGE PREVIEWS */}
            {imagePreviews.length > 0 && (
                <div style={{marginBottom: "20px"}}>
                    <h4>Image Preview ({imagePreviews.length}/5):</h4>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px"}}>
                        {imagePreviews.map((preview, index) => (
                            <div
                                key={index}
                                style={{
                                    position: "relative",
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    overflow: "hidden"
                                }}
                            >
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "120px",
                                        objectFit: "cover"
                                    }}
                                />
                                <button
                                    onClick={() => handleDeleteImage(index)}
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
                                        fontSize: "18px"
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
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
                onClick={() => navigate("/my-books")}
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