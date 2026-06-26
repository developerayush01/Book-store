import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import Skeleton from "../components/Skeleton";

function Cart() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !user) navigate("/login");
    }, [user, navigate, authLoading]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axiosInstance.get("/api/cart/my-cart");
                setCart(response.data.cartItems);
            } catch (error) {
                setError(error.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const handleSelectAll = () => {
        if (selectAll) setSelectedItems([]);
        else setSelectedItems(cart.map(item => item.id));
        setSelectAll(!selectAll);
    };

    const handleSelect = (id) => {
        if (selectedItems.includes(id)) setSelectedItems(selectedItems.filter(i => i !== id));
        else setSelectedItems([...selectedItems, id]);
    };

    const totalPrice = cart
        .filter(item => selectedItems.includes(item.id))
        .reduce((sum, item) => sum + item.Book.price, 0);

    const deleteItems = async () => {
        if (selectedItems.length === 0) { alert("Please select items to delete"); return; }
        try {
            if (selectAll) {
                await axiosInstance.delete("/api/cart/delete-all");
                setCart([]);
            } else {
                for (const id of selectedItems) {
                    await axiosInstance.delete(`/api/cart/delete/${id}`);
                }
                setCart(cart.filter(item => !selectedItems.includes(item.id)));
            }
            setSelectedItems([]);
            setSelectAll(false);
        } catch (error) {
            alert("Delete failed");
        }
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) { alert("Please select items to checkout"); return; }
        const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
        navigate("/checkout", { state: { selectedCartItems, selectedItems } });
    };

    const CartSkeleton = () => (
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="w-12 h-14 rounded" />
                <div>
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24 mt-1" />
                </div>
            </div>
            <Skeleton className="h-4 w-16" />
        </div>
    );

    const SUPABASE_URL = "https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public/book-covers";

    return (
        <div className="min-h-screen bg-[#F7F3EC] px-4 py-8 pb-24">
            <div className="max-w-4xl mx-auto">

                <h2 className="text-2xl font-bold text-slate-800 mb-6">My Cart</h2>

                {loading ? (
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 3 }).map((_, i) => <CartSkeleton key={i} />)}
                    </div>
                ) : cart.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-3">🛒</p>
                        <p className="text-gray-500">Your cart is empty</p>
                    </div>
                ) : (
                    <>
                        {/* SELECT ALL */}
                        <div className="flex items-center justify-between mb-4 bg-white px-4 py-2.5 rounded-lg shadow-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                    className="accent-amber-700"
                                />
                                <span className="text-sm text-slate-800 font-medium">Select All</span>
                            </label>
                            <span className="text-xs text-gray-400">{selectedItems.length} selected</span>
                        </div>

                        {/* CART ITEMS */}
                        <div className="flex flex-col gap-3">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className={`bg-white rounded-lg shadow-sm p-4 flex items-center justify-between transition ${selectedItems.includes(item.id) ? "border border-amber-700" : "border border-transparent"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleSelect(item.id)}
                                            className="accent-amber-700"
                                        />
                                        <img
                                            src={`${SUPABASE_URL}/${item.book_id}/cover.jpg`}
                                            className="w-12 h-14 object-cover rounded bg-gray-100"
                                            alt={item.Book.title}
                                        />
                                        <div>
                                            <h3 className="font-semibold text-slate-800 text-sm">{item.Book.title}</h3>
                                            <p className="text-xs text-gray-500">{item.Book.author}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-amber-700">Rs {item.Book.price}</p>
                                </div>
                            ))}
                        </div>

                        {/* SUMMARY */}
                        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-500 text-sm">Selected Total</span>
                                <h3 className="text-lg font-bold text-slate-800">Rs {totalPrice}</h3>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={deleteItems}
                                    className="flex-1 border border-red-500 text-red-500 py-2.5 rounded-lg text-sm hover:bg-red-50 transition"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg text-sm transition"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Cart;