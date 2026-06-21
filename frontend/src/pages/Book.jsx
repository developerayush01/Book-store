import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosInstance from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Book() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
const [cartMessage, setCartMessage] = useState("");

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await axiosInstance.get(`/api/books/${id}`);
                setBook(response.data);
            } catch (error) {
                alert("Something went wrong");
            }
        }
        fetchBook();
    }, [id]);

    useEffect(() => {
        if (location.state?.triggerBuyNow && book && user) {
            navigate("/checkout", {
                state: { selectedCartItems: [{ Book: book, book_id: id }] },
                replace: true
            });
        }
    }, [location.state, book, user]);

useEffect(() => {
  if (location.state?.cartSuccess) {
    setCartMessage("Added to Cart Successfully");
    window.history.replaceState({}, document.title);
    setTimeout(() => setCartMessage(""), 3000);
  }
}, [location.state]);

    const handleBuy = async () => {
        try {
            if (!user) {
                navigate("/login", {
                    state: { from: `/books/${id}`, action: "buyNow", book_id: id }
                });
                return;
            }

            navigate("/checkout", {
                state: { selectedCartItems: [{ Book: book, book_id: id }] }
            });
        } catch (error) {
            alert("Server error");
        }
    };

    const handleCart = async () => {
        try {
            if (!user) {
                navigate("/login", {
                    state: { from: `/books/${id}`, action: "addToCart", book_id: id }
                });
                return;
            }
            await axiosInstance.post("/api/cart/add-cart", { book_id: id });
            setCartMessage("Added to Cart Successfully");
    setTimeout(() => setCartMessage(""), 3000);
        } catch (error) {
            alert("Cannot add to cart");
        }
    };


const SUPABASE_URL =
  "https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public";

const coverImageUrl =
  `${SUPABASE_URL}/book-covers/${id}/cover.jpg`;

const otherImages = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  url: `${SUPABASE_URL}/book-images/books/${id}/image-${i + 1}.jpg`,
}));


return (
     <div className="min-h-screen bg-[#F7F3EC] py-10 px-4">

{cartMessage && (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
        {cartMessage}
      </div>
    )}

  {book ? (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10">

      {/* TOP SECTION */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* LEFT: IMAGES */}
        <div>

          {/* Main Cover */}
          <img
            src={coverImageUrl}
            alt="Cover"
            className="w-full h-80 object-cover rounded-lg bg-gray-200"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />

          {/* Thumbnails */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {otherImages.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt={`Book ${img.id}`}
                className="w-20 h-20 object-cover rounded-md border hover:scale-105 transition"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ))}
          </div>

        </div>

        {/* RIGHT: DETAILS */}
        <div className="flex flex-col">

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {book.title}
          </h1>

          {/* Author */}
          <p className="text-gray-500 mt-1">
            by {book.author}
          </p>

          <p className="text-gray-500 mt-1">
            by {book.User.name}
          </p>

          {/* Price */}
          <p className="text-blue-600 text-xl font-bold mt-4">
            Rs {book.price}
          </p>

          {/* Condition */}
          <p className="mt-2 text-sm text-gray-600">
            Condition: <span className="font-semibold">{book.condition}</span>
          </p>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">

            <button
              onClick={handleBuy}
              className="bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700 transition"
            >
              Buy Now
            </button>

            <button
              onClick={handleCart}
              className="border border-slate-800 text-slate-800 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              Add to Cart
            </button>

          </div>

        </div>

      </div>

    </div>
  ) : (
    <p className="text-center text-gray-500">Loading...</p>
  )}

</div>
);
}

export default Book;