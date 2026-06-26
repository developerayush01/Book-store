import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Skeleton from "../components/Skeleton";

function Home() {
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartMessage, setCartMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const fetchBooks = async (page = 1, searchQuery = "") => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/books/get-all", {
        params: { page, search: searchQuery }
      });
      setBook(response.data.book);
      setTotalPages(response.data.totalPages);
      setTotalBooks(response.data.totalBooks);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(1, search);
  }, [search]);

  useEffect(() => {
    if (location.state?.cartSuccess) {
      setCartMessage("Added to Cart Successfully");
      window.history.replaceState({}, document.title);
      setTimeout(() => setCartMessage(""), 3000);
    }
  }, [location.state]);

  // Debounce search — wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCart = async (book_id) => {
    if (!user) {
      navigate("/login", { state: { from: "/", action: "addToCart", book_id } });
      return;
    }
    try {
      setAddingToCart(book_id);
      await axiosInstance.post("/api/cart/add-cart", { book_id });
      setBook((prevBooks) => prevBooks.filter((b) => b.id !== book_id));
      setCartMessage("Added to Cart Successfully");
      setTimeout(() => setCartMessage(""), 3000);
    } catch (error) {
      alert("Cannot add to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchBooks(page, search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const BookSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm p-3">
      <Skeleton className="w-full h-44 rounded-md" />
      <Skeleton className="mt-3 h-4 w-3/4" />
      <Skeleton className="mt-1 h-3 w-1/2" />
      <Skeleton className="mt-1 h-3 w-1/3" />
      <Skeleton className="mt-2 h-4 w-1/4" />
      <Skeleton className="mt-3 h-7 w-full rounded" />
      <Skeleton className="mt-2 h-7 w-full rounded" />
    </div>
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-10">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ←
        </button>

        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              currentPage === page
                ? "bg-slate-800 text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          →
        </button>
      </div>
    );
  };

  return (
    <div className="pb-24 min-h-screen bg-[#F7F3EC]">

      {/* TOAST */}
      {cartMessage && (
        <div className="fixed top-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">
          ✓ {cartMessage}
        </div>
      )}

      {/* HERO */}
      <div className="bg-slate-800 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">

          <span className="inline-block bg-amber-700 text-white text-xs px-3 py-1 rounded-full mb-4 font-medium">
            Nepal's Secondhand Book Marketplace
          </span>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Give Books a <span className="text-amber-400">Second Life</span> 📚
          </h1>

          <p className="mt-4 text-gray-300 text-sm md:text-base max-w-xl mx-auto">
            Buy and sell secondhand books — Atomic Habits, novels, spiritual texts and more.
            Affordable, meaningful, and sustainable reading for everyone.
          </p>

          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <span className="px-4 py-1.5 bg-slate-700 text-gray-200 text-xs rounded-full">📈 Self Growth</span>
            <span className="px-4 py-1.5 bg-slate-700 text-gray-200 text-xs rounded-full">📖 Novels</span>
            <span className="px-4 py-1.5 bg-slate-700 text-gray-200 text-xs rounded-full">🕉️ Religious</span>
            <span className="px-4 py-1.5 bg-slate-700 text-gray-200 text-xs rounded-full">📚 Textbooks</span>
          </div>

        </div>
      </div>

      {/* BOOKS SECTION */}
      <div className="max-w-7xl mx-auto px-4 pt-10">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {search ? `Results for "${search}"` : "Available Books"}
          </h2>
          <span className="text-sm text-gray-500">
            {!loading && `${totalBooks} books`}
          </span>
        </div>

{/* SEARCH BOX */}
  <div className="relative mb-6">
    <input
      type="text"
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
      placeholder="Search by title or author..."
      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-slate-800 text-sm focus:outline-none focus:border-amber-700"
    />
    {searchInput && (
      <button
        onClick={() => { setSearchInput(""); setSearch(""); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
      >
        ✕
      </button>
    )}
  </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <BookSkeleton key={i} />)
          ) : book.filter(b => b.seller_id !== user?.id).length === 0 ? (
            <div className="col-span-4 text-center py-20">
              <p className="text-4xl mb-3">📚</p>
              <p className="text-gray-500">
                {search ? `No books found for "${search}"` : "No books available right now"}
              </p>
            </div>
          ) : (
            book.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
                  <div className="relative">
                    <img
                      src={`https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public/book-covers/${book.id}/cover.jpg`}
                      alt={book.title}
                      className="w-full h-44 object-cover bg-gray-100"
                    />
                    <span className="absolute top-2 right-2 bg-slate-800 text-white text-xs px-2 py-0.5 rounded-full">
                      {book.condition}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-slate-800 line-clamp-1">{book.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                    <p className="text-xs text-gray-400 mt-0.5">by {book.User.name}</p>
                    <p className="text-amber-700 font-bold mt-2 text-sm">Rs {book.price}</p>

                    <Link
                      to={`/books/${book.id}`}
                      className="block mt-3 text-center bg-slate-800 hover:bg-slate-700 text-white text-xs py-1.5 rounded transition"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => handleCart(book.id)}
                      disabled={addingToCart === book.id}
                      className="block mt-2 w-full text-xs py-1.5 rounded border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white transition disabled:opacity-50"
                    >
                      {addingToCart === book.id ? (
                        <span className="flex items-center justify-center gap-1">
                          <div className="w-3 h-3 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </span>
                      ) : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* PAGINATION */}
        <Pagination />

      </div>
    </div>
  );
}

export default Home;