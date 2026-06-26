import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosInstance from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Skeleton from '../components/Skeleton'
import Spinner from '../components/Spinner'

function Book() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
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
            } finally {
                setLoading(false);
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
            setAddingToCart(true);
            await axiosInstance.post("/api/cart/add-cart", { book_id: id });
            setCartMessage("Added to Cart Successfully");
            setTimeout(() => setCartMessage(""), 3000);
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            alert("Cannot add to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    const SUPABASE_URL = "https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public";
    const coverImageUrl = `${SUPABASE_URL}/book-covers/${id}/cover.jpg`;
    const otherImages = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        url: `${SUPABASE_URL}/book-images/books/${id}/image-${i + 1}.jpg`,
    }));

    const BookSkeleton = () => (
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <Skeleton className="w-full h-80 rounded-lg" />
                    <div className="flex gap-2 mt-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="w-20 h-20 rounded-md" />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-1/4 mt-2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-full mt-4" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F7F3EC] py-10 px-4">

            {cartMessage && (
                <div className="fixed top-4 right-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">
                    ✓ {cartMessage}
                </div>
            )}

            {loading ? (
                <BookSkeleton />
            ) : book ? (
                <>
                    {(book.status === "Reserved" || book.status === "Sold") ? (
                        <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center">
                            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                                <div className="text-5xl mb-4">📚</div>
                                <h1 className="text-2xl font-bold text-slate-800 mb-2">
                                    {book.status === "Reserved" ? "Book is Reserved" : "Book is Sold"}
                                </h1>
                                <p className="text-gray-500 mb-6">
                                    {book.status === "Reserved"
                                        ? "This book is currently reserved by another user."
                                        : "This book has already been sold."}
                                </p>
                                <button
                                    onClick={() => navigate("/")}
                                    className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition"
                                >
                                    Browse Other Books
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-10">
                            <div className="grid md:grid-cols-2 gap-8">

                                {/* LEFT: IMAGES */}
                                <div>
                                    <img
                                        src={coverImageUrl}
                                        alt="Cover"
                                        className="w-full h-80 object-cover rounded-lg bg-gray-100"
                                        onError={(e) => { e.target.style.display = "none"; }}
                                    />
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {otherImages.map((img) => (
                                            <img
                                                key={img.id}
                                                src={img.url}
                                                alt={`Book ${img.id}`}
                                                className="w-20 h-20 object-cover rounded-md border border-gray-200 hover:scale-105 transition"
                                                onError={(e) => { e.target.style.display = "none"; }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* RIGHT: DETAILS */}
                                <div className="flex flex-col">

                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                                        {book.title}
                                    </h1>

                                    <p className="text-gray-500 mt-1 text-sm">by {book.author}</p>
                                    <p className="text-gray-400 mt-1 text-sm">Seller: {book.User.name}</p>

                                    <p className="text-amber-700 text-xl font-bold mt-4">
                                        Rs {book.price}
                                    </p>

                                    <p className="mt-2 text-sm text-gray-600">
                                        Condition: <span className="font-semibold text-slate-800">{book.condition}</span>
                                    </p>

                                    {book.description && (
                                        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                                            {book.description}
                                        </p>
                                    )}

                                    <div className="mt-6 flex flex-col gap-3">
                                        <button
                                            onClick={handleBuy}
                                            className="bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg transition font-medium"
                                        >
                                            Buy Now
                                        </button>

                                        <button
                                            onClick={handleCart}
                                            disabled={addingToCart}
                                            className="border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white py-2.5 rounded-lg transition font-medium disabled:opacity-50"
                                        >
                                            {addingToCart ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Spinner dark />
                                                    Adding...
                                                </span>
                                            ) : "Add to Cart"}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center text-gray-500">Something went wrong</p>
            )}
        </div>
    );
}

export default Book;