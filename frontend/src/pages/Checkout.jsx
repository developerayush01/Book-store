import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { initializeEsewaPayment } from "../api/payment";
import Spinner from "../components/Spinner";

function Checkout() {
  const [error, setError] = useState("");
  const [address, setAddress] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    district: "",
    province: "",
  });
  const [payingEsewa, setPayingEsewa] = useState(false);
  const [payingCOD, setPayingCOD] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const location = useLocation();
  const { selectedCartItems } = location.state;
  const bookIds = selectedCartItems.map((item) => item.book_id);
  const totalPrice = selectedCartItems.reduce(
    (sum, item) => sum + item.Book.price,
    0,
  );

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, navigate, loading]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axiosInstance.get("/api/address/my-address");
        setAddress(response.data.address);
        const defaultAddress = response.data.address.find(
          (addr) => addr.is_default,
        );
        if (defaultAddress) setSelectedAddressId(defaultAddress.id);
      } catch (error) {
        ("Error:", error.response?.data);
      }
    };
    fetchAddress();
  }, []);

  const handlePayment = async () => {
    try {
      setPayingCOD(true);
      await axiosInstance.post("/api/orders/create-order", {
        bookIds,
        address_id: selectedAddressId,
      });
      if (
        selectedCartItems[0].id &&
        selectedCartItems[0].id !== selectedCartItems[0].book_id
      ) {
        for (const item of selectedCartItems) {
          await axiosInstance.delete(`/api/cart/delete/${item.id}`);
        }
      }
      navigate("/my-orders");
    } catch (error) {
      ("Error:", error.response?.data);
      alert("Order failed!");
    } finally {
      setPayingCOD(false);
    }
  };

  const handleEsewa = async () => {
    try {
      setPayingEsewa(true);
      await initializeEsewaPayment(bookIds, totalPrice, selectedAddressId);
    } catch (error) {
      alert("Payment failed!");
    } finally {
      setPayingEsewa(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await axiosInstance.put(`/api/address/set-default/${addressId}`);
      const response = await axiosInstance.get("/api/address/my-address");
      setAddress(response.data.address);
    } catch (error) {
      alert("Failed to set default address");
    }
  };

  const handleAddNewAddress = async (formData) => {
    try {
      await axiosInstance.post("/api/address/add-address", formData);
      const response = await axiosInstance.get("/api/address/my-address");
      setAddress(response.data.address);
      setShowAddressForm(false);
      setFormData({ street: "", city: "", district: "", province: "" });
    } catch (error) {
      alert("Failed to add address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axiosInstance.delete(`/api/address/delete/${addressId}`);
      const response = await axiosInstance.get("/api/address/my-address");
      setAddress(response.data.address);
    } catch (error) {
      alert("Failed to delete address");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Checkout</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT: ITEMS */}
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4 text-slate-800 border-b pb-2">
              Selected Items
            </h3>

            <div className="flex flex-col gap-3">
              {selectedCartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public/book-covers/${item.book_id}/cover.jpg`}
                      alt={item.Book.title}
                      className="w-14 h-16 object-cover rounded bg-gray-100"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.Book.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.Book.author}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-amber-700">
                    Rs {item.Book.price}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t flex justify-between items-center">
              <span className="text-gray-500 text-sm">Total</span>
              <h3 className="text-lg font-bold text-slate-800">
                Rs {totalPrice}
              </h3>
            </div>
          </div>

          {/* RIGHT: ADDRESS */}
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4 text-slate-800 border-b pb-2">
              Delivery Address
            </h3>

            {address.length === 0 ? (
              <div className="text-gray-500 text-sm">
                <p>No delivery address found</p>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="mt-3 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-sm transition"
                >
                  Add New Address
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {address.map((addr) => (
                  <div
                    key={addr.id}
                    className={`border rounded-lg p-3 transition ${selectedAddressId === addr.id ? "border-amber-700 bg-amber-50" : "border-gray-200"}`}
                  >
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-0.5 accent-amber-700"
                      />
                      <span className="text-sm text-gray-700">
                        {addr.street}, {addr.city}, {addr.district},{" "}
                        {addr.province}
                        {addr.is_default && (
                          <span className="ml-1 text-green-600 font-semibold text-xs">
                            (Default)
                          </span>
                        )}
                      </span>
                    </label>

                    <div className="flex gap-3 mt-2 ml-5">
                      {!addr.is_default && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-xs text-amber-700 hover:underline"
                        >
                          Make Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setShowAddressForm(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-sm w-fit transition"
                >
                  + Add New Address
                </button>
              </div>
            )}

            {/* ADDRESS FORM */}
            {showAddressForm && (
              <div className="mt-4 border-t pt-4 flex flex-col gap-2">
                {["street", "city", "district", "province"].map((field) => (
                  <input
                    key={field}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="border border-gray-200 p-2 rounded text-sm focus:outline-none focus:border-amber-700"
                  />
                ))}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAddNewAddress(formData)}
                    className="bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm transition"
                  >
                    Save Address
                  </button>
                  <button
                    onClick={() => setShowAddressForm(false)}
                    className="border border-gray-300 px-3 py-1.5 rounded text-sm hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PAYMENT */}
        <div className="mt-6 bg-white p-5 rounded-lg shadow-sm flex flex-col gap-3">
          <h3 className="font-semibold text-slate-800 border-b pb-2">
            Payment Method
          </h3>

          <button
            onClick={handleEsewa}
            disabled={payingEsewa}
            className="w-full bg-green-700 hover:bg-green-600 text-white py-3 rounded-lg transition font-semibold disabled:opacity-50"
          >
            {payingEsewa ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Processing...
              </span>
            ) : (
              "Pay with eSewa"
            )}
          </button>

          <button
            onClick={handlePayment}
            disabled={payingCOD}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg transition font-semibold disabled:opacity-50"
          >
            {payingCOD ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Placing Order...
              </span>
            ) : (
              "Cash On Delivery"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
