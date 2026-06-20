import { Link, useNavigate,useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [book, setBook] = useState([]);
  const [error,setError] = useState("");
  const {user}=useAuth();
  const navigate = useNavigate();
  const location=useLocation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get("/api/books/get-all");
        setBook(response.data.book);
      } catch (error) {
        setError(error.response.data.message || "Something went wrong");
      }
    };
    fetchBooks();
  }, []);

  const handleCart = async (book_id) => {
  if (!user) {
    navigate("/login", {
      state: { from: "/", action: "addToCart", book_id }
    });
    return;
  }

  try {
    await axiosInstance.post("/api/cart/add-cart", { book_id });
    setBook((prevBooks) => prevBooks.filter((b) => b.id !== book_id));
    alert("Added to Cart Successfully");
  } catch (error) {
    console.log(error);
    alert("Cannot add to cart");
  }
};

  return (
    
    <div className="pb-20">
      
      <div>
        <div>
        <input type="text" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 pb-8">

    <div className="text-center">

      <h1 className="text-3xl md:text-5xl font-bold text-slate-800">
        Give Books a Second Life 📚
      </h1>

      <p className="mt-3 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
        Buy and sell second-hand books like Atomic Habits, novels, and spiritual texts.
        Affordable, meaningful, and sustainable reading for everyone.
      </p>

      <div className="mt-5 flex justify-center gap-3">
        <span className="px-3 py-1 bg-slate-800 text-white text-xs rounded-full">
          Self Growth
        </span>
        <span className="px-3 py-1 bg-amber-500 text-white text-xs rounded-full">
          Novels
        </span>
        <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
          Religious
        </span>
      </div>

    </div>

  </div>

      { book && book.length === 0 ? (
    <p className="text-center text-gray-500 mt-10">No books available</p>
) : (
  
  <div className="max-w-7xl mx-auto px-0 md:px-4">

    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">

      {book &&
        book
          .filter(b => b.seller_id !== user?.id)
          .map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-3"
            >

              <img
                src={`https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public/book-covers/${book.id}/cover.jpg`}
                alt={book.title}
                className="w-full h-40 object-cover rounded-md bg-gray-200"
              />

              <h3 className="mt-2 font-semibold text-sm text-gray-800">
                {book.title}
              </h3>

              <p className="text-xs text-gray-500">{book.author}</p>

              <h3 className="mt-2 font-semibold text-sm text-gray-800">
                {book.User.name}
              </h3>
              <p className="text-blue-600 font-bold mt-1">
                Rs {book.price}
              </p>

              <Link
                to={`/books/${book.id}`}
                className="block mt-3 text-center bg-slate-800 text-white text-sm py-1 rounded hover:bg-slate-700"
              >
                View Details
              </Link>
              <button
  onClick={() => handleCart(book.id)}
  className="block mt-2 w-full text-sm py-1.5 rounded border border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white transition"
>
  Add to Cart
</button>

            </div>
          ))}
    </div>
  </div>
  )}
  </div>
  );
}
export default Home;