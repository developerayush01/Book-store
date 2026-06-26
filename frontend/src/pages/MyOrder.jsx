import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Skeleton from "../components/Skeleton";

function MyOrder() {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, navigate, authLoading]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get("/api/orders/my-order");
        setOrder(response.data.orders);
      } catch (error) {
        setError(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, []);

  const OrderSkeleton = () => (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32 mt-1" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="flex items-center gap-3 border-b pb-3">
        <Skeleton className="w-12 h-14 rounded" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-1 h-3 w-1/4" />
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-7 w-16 rounded" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F3EC] py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-2xl font-bold mb-6 text-slate-800">My Orders</h2>

        {loading ? (
          <div className="flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, i) => <OrderSkeleton key={i} />)}
          </div>
        ) : !order || order.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {order.map((order) => (
              <div key={order.id} className="bg-white p-5 rounded-lg shadow-sm">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                  <div>
                    <p className="text-xs text-gray-400 font-mono">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* ITEMS */}
                <div className="flex flex-col gap-3">
                  {order.OrderItems && order.OrderItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 border-b pb-3">
                      <img
                        src={`https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public/book-covers/${item.book_id}/cover.jpg`}
                        alt={item.Book?.title}
                        className="w-12 h-14 object-cover rounded bg-gray-100"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.Book?.title}</p>
                        <p className="text-xs text-amber-700 font-medium">Rs {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-400">Total</span>
                    <p className="font-bold text-slate-800">Rs {order.total_price}</p>
                  </div>
                  <button
                    disabled
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    Cancel
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

export default MyOrder;