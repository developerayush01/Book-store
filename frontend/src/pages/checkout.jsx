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
        const response=await axiosInstance.get("api/address/my-address");
        setAddress(response.data.address);
        const defaultAddress=response.data.address.find(addr=>addr.isdefault);

        if(defaultAddress)
        {
          setSelectedAddressId(defaultAddr.id);
        }

      } catch (error) {
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
    alert("Order failed!");
}
  }

  const handleSetDefault=async()=>{
    try {
      await axiosInstance(`api/address/set-default/${address_id}`);
      const response=await axiosInstance("api/address/my-address");
      setAddress(response.data.address);
    } catch (error) {
      alert("Faioled to set default address");
    }
  };

  const handleAddNewAddress=async()=>{
    await axiosInstance.post("api/address/add-address")

  }
  const handleDelivery=async()=>{

  }

  return (
    <div>
        <h2>Checkout</h2>

        {selectedCartItems.map(item => (
            <div key={item.id}>
                <p>{item.Book.title} - Rs {item.Book.price}</p>
            </div>
        ))}
        <div></div>
        <h3>Total: Rs {totalPrice}</h3>
        <div>
          <h3>Delivery Address</h3>
          <div>
            {
              address.length==0 ?
              (
                <>
                <p>No delivery address</p>
                 <button>Add Address</button>
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
                  </div>
                ))}
                 <button onClick={handleDelivery}>Add New Address</button>
                </>
              )
            }
          </div>
        </div>
        <button onClick={handlePayment}>Place Order</button>
    </div>
);
}

export default Checkout;