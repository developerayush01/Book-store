import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import Skeleton from "../components/Skeleton";

function MyBook() {
    const [book, setBook] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axiosInstance.get("/api/books/my-books");
                setBook(response.data.books);
            } catch (error) {
                setError(error.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const handleDeleteBook = async (book_id) => {
        try {
            await axiosInstance.delete(`/api/books/delete/${book_id}`);
            setBook(prev => prev.filter(b => b.id !== book_id));
        } catch (error) {
            alert("Could not delete book");
        }
    };

    const BookSkeleton = () => (
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-16 rounded" />
                <div>
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24 mt-1" />
                    <Skeleton className="h-4 w-16 mt-1" />
                </div>
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-7 w-14 rounded" />
                <Skeleton className="h-7 w-14 rounded" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F7F3EC] py-10 px-4 pb-24">
            <div className="max-w-5xl mx-auto">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">My Books</h2>
                    <button
                        onClick={() => navigate("/add-book")}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition"
                    >
                        + Add Book
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 3 }).map((_, i) => <BookSkeleton key={i} />)}
                    </div>
                ) : !book || book.length === 0 ? (
                    <div className="text-center mt-20">
                        <p className="text-4xl mb-3">📚</p>
                        <p className="text-gray-500 mb-4">No books listed yet</p>
                        <button
                            onClick={() => navigate("/add-book")}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                            Add Your First Book
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {book.map((book) => (
                            <div key={book.id} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">

                                <div className="flex items-center gap-4">
                                    <img
                                        src={`https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public/book-covers/${book.id}/cover.jpg`}
                                        alt={book.title}
                                        className="w-14 h-16 object-cover rounded bg-gray-100"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-slate-800">{book.title}</h3>
                                        <p className="text-sm text-gray-500">{book.author}</p>
                                        <p className="text-amber-700 font-bold text-sm">Rs {book.price}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            book.status === "Available" ? "bg-green-100 text-green-700"
                                            : book.status === "Reserved" ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}>
                                            {book.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/edit-book/${book.id}`)}
                                        className="px-3 py-1.5 text-xs border border-slate-800 text-slate-800 rounded-lg hover:bg-slate-50 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBook(book.id)}
                                        className="px-3 py-1.5 text-xs border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition"
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

export default MyBook;