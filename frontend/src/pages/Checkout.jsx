import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import {useAuth} from '../context/AuthContext'
import { useNavigate,useLocation} from "react-router-dom";
import { initializeEsewaPayment } from "../api/payment";

function Checkout() {
    const [order, setOrder] = useState([]);
  const [error,setError] = useState("");
  const [address,setAddress]=useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData,setFormData]=useState({
    street: "",
    city: "",
    district: "",
    province: ""});
  const navigate = useNavigate();
  const {user, loading}=useAuth();
  const location = useLocation();
  const { selectedCartItems } = location.state;
  const bookIds = selectedCartItems.map(item => item.book_id);
   const totalPrice = selectedCartItems.reduce((sum, item) => sum + item.Book.price, 0)

  useEffect(()=>{
if (!loading && !user)
  {
    navigate("/login");
  }
  },[user,navigate,loading]);


  useEffect(()=>{
    const fetchAddress=async()=>{
      try {
        const response=await axiosInstance.get("/api/address/my-address");
        setAddress(response.data.address);
        const defaultAddress=response.data.address.find(addr=>addr.is_default);
        if(defaultAddress)
        {
          setSelectedAddressId(defaultAddress.id);
        }

      } catch (error) {
        console.log("Error:",error.response?.data)
        alert("Something went wrong");
      }
    }
    fetchAddress();
  },[]);


  const handlePayment=async()=>{
   try {
    await axiosInstance.post("/api/orders/create-order",{bookIds,address_id: selectedAddressId});
    console.log("Order created!");

    if(selectedCartItems[0].id && selectedCartItems[0].id !== selectedCartItems[0].book_id) {
    for(const item of selectedCartItems) {
                await axiosInstance.delete(`/api/cart/delete/${item.id}`);
            }
          }
    navigate("/my-orders");
    } catch(error) {
      console.log("Error:", error.response?.data);
    alert("Order failed!");
}
  }

  const handleSetDefault=async(addressId)=>{
    try {
      await axiosInstance.put(`/api/address/set-default/${addressId}`);
      const response=await axiosInstance.get("/api/address/my-address");
      setAddress(response.data.address);
    } catch (error) {
      alert("Failed to set default address");
    }
  };

  const handleAddNewAddress=async(formData)=>{
    try {
      await axiosInstance.post("/api/address/add-address",formData);

    const response = await axiosInstance.get("/api/address/my-address");
         setAddress(response.data.address);
        setShowAddressForm(false);
        setFormData({ street: "", city: "", district: "", province: "" });
    } catch (error) {
      console.log("Error:", error.response?.data);
      alert("Failed to add address");
    }
  }

  const handleDeleteAddress = async(addressId) => {
    try {
        await axiosInstance.delete(`/api/address/delete/${addressId}`);
        
        const response = await axiosInstance.get("/api/address/my-address");
        setAddress(response.data.address);
    } catch(error) {
        console.log("Error:", error.response?.data);
        alert("Failed to delete address");
    }
};

  return (
    <div className="min-h-screen bg-[#F7F3EC] py-10 px-4">

  <div className="max-w-5xl mx-auto">

    <h2 className="text-2xl font-bold mb-6 text-slate-800">
      Checkout
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

      {/* ================= LEFT: ITEMS ================= */}
      <div className="bg-white p-5 rounded-lg shadow-sm">

        <h3 className="font-semibold mb-3">Selected Items</h3>

        <div className="flex flex-col gap-3">

          {selectedCartItems.map(item => (
  <div
    key={item.id}
    className="flex items-center justify-between border-b pb-3"
  >

    {/* LEFT: IMAGE + INFO */}
    <div className="flex items-center gap-3">

      <img
        src={`https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public/book-covers/${item.book_id}/cover.jpg`}
        alt={item.Book.title}
        className="w-14 h-16 object-cover rounded bg-gray-200"
      />

      <div>
        <p className="text-sm font-semibold text-gray-800">
          {item.Book.title}
        </p>

        <p className="text-xs text-gray-500">
          {item.Book.author}
        </p>
      </div>

    </div>

    {/* RIGHT: PRICE */}
    <p className="font-bold text-blue-600">
      Rs {item.Book.price}
    </p>

  </div>
))}

        </div>

        {/* TOTAL */}
        <div className="mt-4 pt-3 border-t">
          <h3 className="text-lg font-bold">
            Total: Rs {totalPrice}
          </h3>
        </div>

      </div>

      {/* ================= RIGHT: ADDRESS ================= */}
      <div className="bg-white p-5 rounded-lg shadow-sm">

        <h3 className="font-semibold mb-3">
          Delivery Address
        </h3>

        {/* NO ADDRESS */}
        {address.length === 0 ? (
          <div className="text-gray-500 text-sm">
            <p>No delivery address</p>

            <button
              onClick={() => setShowAddressForm(true)}
              className="mt-3 bg-slate-800 text-white px-3 py-1 rounded text-sm"
            >
              Add New Address
            </button>
          </div>

        ) : (
          <div className="flex flex-col gap-3">

            {address.map(addr => (
              <div
                key={addr.id}
                className="border rounded p-3"
              >

                <label className="flex items-start gap-2">

                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />

                  <span className="text-sm text-gray-700">
                    {addr.street}, {addr.city}, {addr.district}, {addr.province}
                    {addr.is_default && (
                      <span className="text-green-600 font-semibold">
                        {" "} (Default)
                      </span>
                    )}
                  </span>

                </label>

                <div className="flex gap-2 mt-2">

                  {!addr.is_default && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-xs text-blue-600"
                    >
                      Make Default
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-xs text-red-500"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

            <button
              onClick={() => setShowAddressForm(true)}
              className="bg-slate-800 text-white px-3 py-1 rounded text-sm w-fit"
            >
              Add New Address
            </button>

          </div>
        )}

        {/* ADDRESS FORM */}
        {showAddressForm && (
          <div className="mt-4 border-t pt-4 flex flex-col gap-2">

            <input
              value={formData.street}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
              placeholder="Street"
              className="border p-2 rounded text-sm"
            />

            <input
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="City"
              className="border p-2 rounded text-sm"
            />

            <input
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              placeholder="District"
              className="border p-2 rounded text-sm"
            />

            <input
              value={formData.province}
              onChange={(e) =>
                setFormData({ ...formData, province: e.target.value })
              }
              placeholder="Province"
              className="border p-2 rounded text-sm"
            />

            <div className="flex gap-2 mt-2">

              <button
                onClick={() => handleAddNewAddress(formData)}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Save Address
              </button>

              <button
                onClick={() => setShowAddressForm(false)}
                className="border px-3 py-1 rounded text-sm"
              >
                Cancel
              </button>

            </div>

          </div>
        )}

      </div>
    </div>

    {/* ================= PAYMENT ================= */}
    <div className="mt-6 bg-white p-5 rounded-lg shadow-sm">

      <button onClick={() => initializeEsewaPayment(bookIds, totalPrice, selectedAddressId)}
        className="w-full bg-slate-800 text-white py-3 rounded hover:bg-slate-700 transition font-semibold">
  Pay with eSewa
</button>

      <button
        onClick={handlePayment}
        className="w-full bg-slate-800 text-white py-3 rounded hover:bg-slate-700 transition font-semibold"
      >
        Place Order
      </button>

    </div>

  </div>
</div>
);
}

export default Checkout;
