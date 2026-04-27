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
    <div>
        {order.length === 0 ? (
            <p>No orders yet</p>
        ) : (
            order.map((order) => (
                <div key={order.id}>
                    
                    <p>Status: {order.status}</p>
                    
                    {order.OrderItems && order.OrderItems.map(item => (
                        <div key={item.id}>
                            <p>{item.Book.title} - Rs {item.price}</p>
                        </div>
                    ))}
                    <h3>Order Total: Rs {order.total_price}</h3>
                    <button disabled>Cancel</button>
                </div>
            ))
        )}
    </div>
);
}
export default MyOrder;