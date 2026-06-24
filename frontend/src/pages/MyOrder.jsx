import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import {useAuth} from '../context/AuthContext'
import { useNavigate} from "react-router-dom";

function MyOrder() {
    const [order, setOrder] = useState([]);
  const [error,setError] = useState("");
  const navigate = useNavigate();
  const {user, loading}=useAuth();

  useEffect(()=>{
if (!loading && !user)
  {
    navigate("/login");
  }
  },[user,navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get("/api/orders/my-order");
        setOrder(response.data.orders);
      } catch (error) {
        setError(error.response.data.message || "Something went wrong");
      }
    };
    fetchOrder();
  }, []);

    return (
    <div className="min-h-screen bg-[#F7F3EC] py-10 px-4">

  <div className="max-w-4xl mx-auto">

    <h2 className="text-2xl font-bold mb-6 text-slate-800">
      My Orders
    </h2>

    {order.length === 0 ? (
      <p className="text-center text-gray-500">
        No orders yet
      </p>
    ) : (
      <div className="flex flex-col gap-5">

        {order.map((order) => (

          <div
            key={order.id}
            className="bg-white p-5 rounded-lg shadow-sm"
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">

               <div>
    <span className="text-sm font-semibold text-gray-700">
      Order ID: {order.id}
    </span>
    jsx<p className="text-xs text-gray-400 mt-1">
  {new Date(order.createdAt).toLocaleString()}
</p>
  </div>

              <span className={`text-xs px-2 py-1 rounded-full ${
                order.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {order.status}
              </span>

            </div>

            {/* ITEMS */}
            <div className="flex flex-col gap-3">

              {order.OrderItems && order.OrderItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-2"
                >

                  {/* LEFT */}
                  <div className="flex items-center gap-3">

                    <img
                      src={`https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public/book-covers/${item.book_id}/cover.jpg`}
                      alt={item.Book.title}
                      className="w-12 h-14 object-cover rounded bg-gray-200"
                    />

                    <div>
                      <p className="text-sm font-semibold">
                        {item.Book.title}
                      </p>

                      <p className="text-xs text-gray-500">
                        Rs {item.price}
                      </p>
                    </div>

                  </div>

                </div>
              ))}

            </div>

            {/* TOTAL */}
            <div className="mt-4 flex justify-between items-center">

              <h3 className="font-bold text-blue-600">
                Total: Rs {order.total_price}
              </h3>

              <button
                disabled
                className="text-xs px-3 py-1 rounded bg-gray-200 text-gray-500 cursor-not-allowed"
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