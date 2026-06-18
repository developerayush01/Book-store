import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import {useAuth} from '../context/AuthContext'
import { useNavigate} from "react-router-dom";

function Cart()
{
    const [cart, setCart] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [error,setError] = useState("");
    const navigate = useNavigate();
    const {user, loading}=useAuth();

  useEffect(()=>{
if (!loading && !user)
  {
    navigate("/login");
  }
  },[user,navigate]);

const handleSelectAll=()=>{
    if(selectAll){
        setSelectedItems([])
    }
    else
    {
        setSelectedItems(cart.map(item => item.id));
    }
    setSelectAll(!selectAll);
};

const handleSelect = (id) => {
    if(selectedItems.includes(id)) {
        setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
        setSelectedItems([...selectedItems, id]);
    }
};

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get("/api/cart/my-cart");
        setCart(response.data.cartItems);
      } catch (error) {
        setError(error.response.data.message || "Something went wrong");
      }
    };
    fetchCart();
  }, []);

  
  const totalPrice = cart.reduce((sum, item) => sum + item.Book.price, 0);

  const deleteItems=async()=>{
    if(selectedItems.length === 0) {
        alert("Please select items to delete");
        return;
    }

    try {
        if(selectAll){
        await axiosInstance.delete("/api/cart/delete-all");
        setCart([]);
        }
        else{
            for(const id of selectedItems)
            {
                await axiosInstance.delete(`/api/cart/delete/${id}`);
            }
            setCart(cart.filter(item => !selectedItems.includes(item.id)));
        }
        setSelectedItems([]);
        setSelectAll(false);
    } catch (error) {
        console.log(error);
        alert("Delete failed");
    }
  };

  const handleCheckout = async() => {
      try {
        if(selectedItems.length === 0) {
            alert("Please select items to checkout");
            return;
        }

        const selectedCartItems=cart.filter(item=>selectedItems.includes(item.id));
        navigate("/checkout",{state:{selectedCartItems,selectedItems}})
        
    } catch (error) {
        alert(error.response.data.message || "Order failed");
    }
};

const SUPABASE_URL = "https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public/book-covers";

  return (
    <div className="min-h-screen bg-[#F7F3EC] px-4 py-8">

  <div className="max-w-4xl mx-auto">

    {/* HEADER CONTROLS */}
    {cart.length !== 0 && (
      <div className="flex items-center justify-between mb-4">

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <span className="text-sm">Select All</span>
        </label>

      </div>
    )}

    {/* EMPTY STATE */}
    {cart.length === 0 ? (
      <p className="text-center text-gray-500 mt-10">
        No items in cart yet
      </p>
    ) : (
      <>
        {/* CART ITEMS */}
        <div className="flex flex-col gap-3">

          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
            >

              {/* LEFT: INFO */}
              <div className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelect(item.id)}
                />
                <img
  src={`${SUPABASE_URL}/${item.book_id}/cover.jpg`}
  className="w-12 h-12 object-cover rounded"
/>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.Book.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.Book.author}
                  </p>
                </div>

              </div>

              {/* RIGHT: PRICE */}
              <div className="text-right">
                <p className="font-bold text-blue-600">
                  Rs {item.Book.price}
                </p>
              </div>

            </div>
          ))}

        </div>

        {/* SUMMARY SECTION */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">

          <h3 className="text-lg font-bold mb-2">
            Total: Rs {totalPrice}
          </h3>

          <div className="flex gap-3">

            <button
              onClick={deleteItems}
              className="flex-1 border border-red-500 text-red-500 py-2 rounded hover:bg-red-50"
            >
              Delete
            </button>

            <button
              onClick={handleCheckout}
              className="flex-1 bg-slate-800 text-white py-2 rounded hover:bg-slate-700"
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