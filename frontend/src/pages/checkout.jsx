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


  const handleCheckout=async()=>{
    try {
        const response = await axiosInstance.post("/api/orders/create-order",{});
        setOrder(response.data.orders);
    } catch (error) {
        
    }
  }
}