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
            
            console.log("book Details:",book)
            setEditFormData({
                title: book.title || "",
                author: book.author || "",
                price: book.price || "",
                condition: book.condition || "",
                description: book.description || ""
            });
            
            if(book.coverImage) {
            console.log("Cover image:", book.coverImage);
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
        <div className="min-h-screen bg-[#F7F3EC] py-10 px-4 pb-20">
  <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">

    {/* Title */}
    <h2 className="text-2xl font-bold text-slate-800 mb-6">
      Edit Book
    </h2>

    {/* Error */}
    {error && (
      <div className="mb-4 rounded-md bg-red-100 border border-red-300 px-3 py-2 text-red-700 text-sm">
        {error}
      </div>
    )}

    {/* Basic Details */}
    <div className="space-y-3">
      <input
        type="text"
        name="title"
        value={editFormData.title}
        onChange={handleInputChange}
        placeholder="Book Title"
        className="w-full border rounded-md px-3 py-2"
      />

      <input
        type="text"
        name="author"
        value={editFormData.author}
        onChange={handleInputChange}
        placeholder="Author"
        className="w-full border rounded-md px-3 py-2"
      />

      <input
        type="number"
        name="price"
        value={editFormData.price}
        onChange={handleInputChange}
        placeholder="Price"
        className="w-full border rounded-md px-3 py-2"
      />

      <input
        type="text"
        name="condition"
        value={editFormData.condition}
        onChange={handleInputChange}
        placeholder="Condition"
        className="w-full border rounded-md px-3 py-2"
      />

      <textarea
        name="description"
        value={editFormData.description}
        onChange={handleInputChange}
        placeholder="Description"
        className="w-full border rounded-md px-3 py-2 min-h-30"
      />
    </div>

    {/* Cover */}
    <div className="mt-8 border rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-3">
        Cover Image
      </h3>

      {coverImagePreview ? (
        <div className="space-y-3">
          <img
            src={coverImagePreview}
            alt="Cover"
            className="w-36 h-48 object-cover rounded-md border"
          />

          <button
            onClick={handleDeleteCoverImage}
            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Remove Cover
          </button>
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-2">
          No cover image uploaded.
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleCoverImageSelect}
        className="mt-3 text-sm"
      />
    </div>

    {/* Gallery */}
    <div className="mt-8">
      <h3 className="font-semibold text-lg mb-4">
        Book Images
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">

        {imageSlots.map((image, slotIndex) => (
          <div
            key={slotIndex}
            className="relative aspect-3/4 border rounded-lg overflow-hidden bg-gray-100"
          >

            {image ? (
              <>
                <img
                  src={image.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() => handleDeleteExistingImage(slotIndex)}
                  className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-600 text-white"
                >
                  ✕
                </button>

                <span className="absolute bottom-1 left-1 text-[10px] bg-black/70 text-white px-2 py-1 rounded">
                  Slot {slotIndex + 1}
                </span>
              </>
            ) : newImages[slotIndex] ? (
              <>
                <img
                  src={URL.createObjectURL(newImages[slotIndex])}
                  alt=""
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() => handleDeleteNewImage(slotIndex)}
                  className="absolute top-1 right-1 w-7 h-7 rounded-full bg-orange-500 text-white"
                >
                  ✕
                </button>

                <span className="absolute bottom-1 left-1 text-[10px] bg-orange-500 text-white px-2 py-1 rounded">
                  NEW
                </span>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center h-full cursor-pointer text-gray-500">
                <span className="text-3xl">+</span>
                <span className="text-xs">
                  Slot {slotIndex + 1}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelectForSlot(slotIndex)}
                  className="hidden"
                />
              </label>
            )}

          </div>
        ))}

      </div>
    </div>

    {/* Actions */}
    <div className="mt-8 flex flex-col gap-3">

      <button
        onClick={handleUpdate}
        disabled={loading}
        className={`w-full py-3 rounded-md text-white font-medium ${
          loading
            ? "bg-gray-400"
            : "bg-slate-800 hover:bg-slate-700"
        }`}
      >
        {loading ? "Saving Changes..." : "Save Changes"}
      </button>

      <button
        onClick={() => navigate("/my-books")}
        className="w-full py-3 rounded-md border border-gray-300 hover:bg-gray-50"
      >
        Cancel
      </button>

    </div>

  </div>
</div>
    );
}

export default EditBook;