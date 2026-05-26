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
    await axiosInstance.post("/api/orders/create-order",{bookIds});
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
                 <button>Add Address</button>
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
                  </div>
                ))}
                 <button>Add New Address</button>
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