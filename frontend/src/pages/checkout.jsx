import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import {useAuth} from '../context/AuthContext'
import { useNavigate,useLocation} from "react-router-dom";

function Checkout() {
    const [order, setOrder] = useState([]);
  const [error,setError] = useState("");
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


  const handlePayment=async()=>{
   try {
    await axiosInstance.post("/api/orders/create-order",{bookIds});

    for(const item of selectedCartItems) {
                await axiosInstance.delete(`/api/cart/delete/${item.id}`);
            }

    navigate("/my-orders");
    } catch (error) {
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

        <h3>Total: Rs {totalPrice}</h3>
        <button onClick={handlePayment}>Place Order</button>
    </div>
);
}

export default Checkout;