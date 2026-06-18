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
            
            if (!coverImage) {
  setError("Please select a cover image");
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
        <div className="min-h-screen bg-[#F7F3EC] py-10 px-4">

  <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">

    {/* TITLE */}
    <h2 className="text-2xl font-bold mb-6 text-slate-800">
      Add New Book
    </h2>

    {/* ERROR */}
    {error && (
      <div className="text-red-500 text-sm mb-3">
        {error}
      </div>
    )}

    {/* ========== BASIC INFO ========== */}
    <div className="grid gap-3">

      <input
        type="text"
        name="title"
        placeholder="Book Title"
        value={bookFormData.title}
        onChange={handleInputChange}
        className="border p-2 rounded text-sm"
      />

      <input
        type="text"
        name="author"
        placeholder="Author"
        value={bookFormData.author}
        onChange={handleInputChange}
        className="border p-2 rounded text-sm"
      />

      <input
        type="number"
        name="price"
        placeholder="Price (Rs)"
        value={bookFormData.price}
        onChange={handleInputChange}
        className="border p-2 rounded text-sm"
      />

      <input
        type="text"
        name="condition"
        placeholder="Condition (New / Good / Like New)"
        value={bookFormData.condition}
        onChange={handleInputChange}
        className="border p-2 rounded text-sm"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={bookFormData.description}
        onChange={handleInputChange}
        className="border p-2 rounded text-sm min-h-25"
      />

    </div>

    {/* ========== COVER IMAGE ========== */}
    <div className="mt-6 border rounded p-4">

      <h3 className="font-semibold mb-3">
        Cover Image
      </h3>

      {coverImagePreview ? (
        <div className="mb-3">
          <img
            src={coverImagePreview}
            alt="Cover"
            className="w-32 h-44 object-cover rounded"
          />

          <button
            onClick={handleDeleteCoverImage}
            className="mt-2 text-xs text-red-500"
          >
            Remove Cover
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-2">
          No cover selected
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleCoverImageSelect}
        className="text-sm"
      />

    </div>

    {/* ========== IMAGE GRID ========== */}
    <div className="mt-6">

      <h3 className="font-semibold mb-3">
        Book Images (5 slots)
      </h3>

      <div className="grid grid-cols-5 gap-3">

        {imageSlots.map((image, index) => (
          <div
            key={index}
            className="border rounded aspect-3/4 relative overflow-hidden bg-gray-100"
          >

            {image ? (
              <>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`slot-${index}`}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full"
                >
                  ✕
                </button>

                <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 text-white px-1 rounded">
                  {index + 1}
                </span>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-500 text-xs">

                <span className="text-lg">+</span>
                <span>Slot {index + 1}</span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelectForSlot(index)}
                  className="hidden"
                />

              </label>
            )}

          </div>
        ))}

      </div>

    </div>

    {/* ========== ACTIONS ========== */}
    <div className="mt-6 flex flex-col gap-3">

      <button
        onClick={handleAddBook}
        disabled={loading}
        className={`w-full py-2 rounded text-white text-sm ${
          loading ? "bg-gray-400" : "bg-slate-800 hover:bg-slate-700"
        }`}
      >
        {loading ? "Adding Book..." : "Add Book"}
      </button>

      <button
        onClick={() => navigate("/")}
        className="w-full py-2 rounded border text-sm"
      >
        Cancel
      </button>

    </div>

  </div>
</div>
    );
}

export default AddBook;