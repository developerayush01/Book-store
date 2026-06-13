import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import {useAuth} from '../context/AuthContext'
import { useNavigate, useParams } from "react-router-dom";

function EditBook() {
    const [showEditForm,setshowEditForm]=useState(false);
    const [EditBook,setEditBook]=useState(null);
    const [editFormData,setEditFormData]=useState({
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
  const navigate = useNavigate();
  const {user}=useAuth();
   const { bookId } = useParams();

  useEffect(() => {
    if(!user) {
        navigate("/login");
    }
}, [user,navigate]);

 useEffect(() => {
        if(!user) {
            navigate("/login");
            return;
        }
        fetchBookDetails();
    }, [bookId, user, navigate]);

    const fetchBookDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/books/${bookId}`);
        console.log("Full response:", response);
    console.log("response.data:", response.data);
    console.log("response.data.book:", response.data.book);
    console.log("response.data.books:", response.data.books);
        const book=response.data;
        setEditFormData({
                title: book.title,
                author: book.author,
                price: book.price,
                condition: book.condition,
                description: book.description
            });
            if(book.BookImages) {
                setBookImages(book.BookImages);
            }
      } catch (error) {
        setError(error.response.data.message || "Something went wrong");
      }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

     const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        
        // Check total images (existing + new)
        const totalImages = bookImages.length + files.length;
        if(totalImages > 5) {
            setError(`Maximum 5 images allowed. You have ${bookImages.length} existing images.`);
            return;
        }
        
        setSelectedImages(files);
        
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
        setError("");
    };

    const handleDeleteExistingImage = async(imageId) => {
        try {
            await axiosInstance.delete(`/api/books/delete-image/${imageId}`);
            setBookImages(bookImages.filter(img => img.id !== imageId));
        } catch(error) {
            alert("Could not delete image");
        }
    };

     const handleDeleteNewImage = (index) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
        
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
        setImagePreviews(updatedPreviews);
    };

    const handleUpdate = async() => {
        try {
            setLoading(true);
            setError("");
            
            // STEP 1: Update book details
            await axiosInstance.put(
                `/api/books/edit/${bookId}`,
                editFormData
            );
            
            console.log("Book updated");
            
            // STEP 2: Upload new images
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
            
            {/* FORM INPUTS */}
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
                style={{display: "block", width: "100%", padding: "10px", marginBottom: "10px", minHeight: "100px"}}
            />
            
            {/* EXISTING IMAGES */}
            {bookImages.length > 0 && (
                <div style={{marginBottom: "20px"}}>
                    <h4>Current Images ({bookImages.length}):</h4>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px"}}>
                        {bookImages.map((image, index) => (
                            <div key={image.id} style={{position: "relative", border: "1px solid #ccc", borderRadius: "5px"}}>
                                <img
                                    src={image.image_url}
                                    alt={`Book ${index + 1}`}
                                    style={{width: "100%", height: "120px", objectFit: "cover"}}
                                />
                                <button
                                    onClick={() => handleDeleteExistingImage(image.id)}
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
                                        cursor: "pointer"
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* ADD NEW IMAGES */}
            {bookImages.length < 5 && (
                <div style={{marginBottom: "20px"}}>
                    <label style={{display: "block", marginBottom: "10px"}}>
                        <strong>Add More Images (max {5 - bookImages.length}):</strong>
                    </label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{marginBottom: "10px"}}
                    />
                </div>
            )}
            
            {/* NEW IMAGE PREVIEWS */}
            {imagePreviews.length > 0 && (
                <div style={{marginBottom: "20px"}}>
                    <h4>New Images ({imagePreviews.length}):</h4>
                    <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px"}}>
                        {imagePreviews.map((preview, index) => (
                            <div key={index} style={{position: "relative", border: "1px solid #ccc", borderRadius: "5px"}}>
                                <img
                                    src={preview}
                                    alt={`New ${index + 1}`}
                                    style={{width: "100%", height: "120px", objectFit: "cover"}}
                                />
                                <button
                                    onClick={() => handleDeleteNewImage(index)}
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
                                        cursor: "pointer"
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