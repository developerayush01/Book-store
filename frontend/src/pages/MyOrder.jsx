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
            {order.length===0 ? (
              <p>No orders yet</p>
            ) : (
                order.map((order)=>(
                <div key={order.id}>
                        <h3>{order.total_price}</h3>
          <p>{order.status}</p>
          <button disabled>Cancel</button>
    </div>
                ))
            )}
            </div>
);
}
export default MyOrder;