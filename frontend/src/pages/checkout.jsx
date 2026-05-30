import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import {useAuth} from '../context/AuthContext'
import { useNavigate,useLocation} from "react-router-dom";

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
    <div>
        <h2>Checkout</h2>

        {selectedCartItems.map(item => (
            <div key={item.id}>
                <p>{item.Book.title} - Rs {item.Book.price}</p>
            </div>
        ))}
        <h3>Total: Rs {totalPrice}</h3>
        <div>
          <h3>Delivery Address</h3>
          <div>
            {
              address.length==0 ?
              (
                <>
                <p>No delivery address</p>
                 <button onClick={() =>{ console.log("Button clicked!"); setShowAddressForm(true)}}>Add New Address</button>
                 </>
              ):
              (
                <>
                {address.map(addr=>(
                  <div key={addr.id}>
                    <input type="radio" name="address" 
                    checked={selectedAddressId === addr.id}
                     onChange={() => setSelectedAddressId(addr.id)} />
                     <label>
                        {addr.street}, {addr.city}, {addr.district}, {addr.province}
                        {addr.is_default && <span> (Default)</span>}
                    </label>
                    {!addr.is_default && (
            <button onClick={() => handleSetDefault(addr.id)}>
                Make Default
            </button>
            
        )}
        <button onClick={() => handleDeleteAddress(addr.id)}>
                Delete
            </button>
                  </div>
                  
                ))}
                <button onClick={() =>{setShowAddressForm(true)}}>Add New Address</button> 
                </>
              )}

              {showAddressForm && (
    <div>
      <input 
    value={formData.street}
    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
    placeholder="Enter street"
/>
<input 
    value={formData.city}
    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
    placeholder="Enter City"
/>
<input 
    value={formData.district}
    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
    placeholder="Enter District"
/>
<input 
    value={formData.province}
    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
    placeholder="Enter Province"
/>
        <button onClick={() => handleAddNewAddress(formData)}>Save Address</button>
        <button onClick={() => setShowAddressForm(false)}>Cancel</button>
    </div>
)}
          </div>
        </div>
        <button onClick={handlePayment}>Place Order</button>
    </div>
);
}

export default Checkout;