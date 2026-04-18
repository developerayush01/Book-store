import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import {useAuth} from '../context/AuthContext'
import { useNavigate} from "react-router-dom";

function Cart()
{
        const [cart, setCart] = useState([]);
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
  return (
    <div>
            {cart.length===0 ? (
              <p>No items in cart yet</p>
            ) : (
                cart.map((cart)=>(
                <div key={cart.id}>
                        <h3>{cart.Book.title}</h3>
                        <h3>{cart.Book.author}</h3>
                        <h3>{cart.Book.price}</h3>
    </div>
                ))
            )}
            <h3>Total:{totalPrice}</h3>
            <button>Checkout</button>
            </div>
);
}

export default Cart;