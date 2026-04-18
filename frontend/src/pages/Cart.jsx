import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import {useAuth} from '../context/AuthContext'
import { useNavigate} from "react-router-dom";

function Cart()
{
    const [cart, setCart] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [error,setError] = useState("");
    const navigate = useNavigate();
    const {user, loading}=useAuth();

  useEffect(()=>{
if (!loading && !user)
  {
    navigate("/login");
  }
  },[user,navigate]);

const handleSelectAll=()=>{
    if(selectAll){
        setSelectedItems([])
    }
    else
    {
        setSelectedItems(cart.map(item => item.id));
    }
    setSelectAll(!selectAll);
};

const handleSelect = (id) => {
    if(selectedItems.includes(id)) {
        setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
        setSelectedItems([...selectedItems, id]);
    }
};

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

  const deleteItems=async()=>{
    if(selectedItems.length === 0) {
        alert("Please select items to delete");
        return;
    }

    try {
        if(selectAll){
        await axiosInstance.delete("/api/cart/delete-all");
        setCart([]);
        }
        else{
            for(const id of selectedItems)
            {
                await axiosInstance.delete(`/api/cart/delete/${id}`);
            }
            setCart(cart.filter(item => !selectedItems.includes(item.id)));
        }
        setSelectedItems([]);
        setSelectAll(false);
    } catch (error) {
        console.log(error);
        alert("Delete failed");
    }
  };

  const handleCheckout = async() => {
    if(selectedItems.length === 0) {
        alert("Please select items to checkout");
        return;
    }
    try {
        const bookIds=cart.filter(item=>selectedItems.includes(item.id))
        .map(item=>item.book_id);

        await axiosInstance.post("/api/orders/create-order",{bookIds});

        for(const id of selectedItems) {
    await axiosInstance.delete(`/api/cart/delete/${id}`);
}

setCart(cart.filter(item => !selectedItems.includes(item.id)));
setSelectedItems([]);
setSelectAll(false);

alert("Order is placed")
    } catch (error) {
        alert(error.response.data.message || "Order failed");
    }
};


  return (
    <div>
            {cart.length===0 ? (
              <p>No items in cart yet</p>
            ) : (
                <>
                <input 
            type="checkbox" 
            checked={selectAll} 
            onChange={handleSelectAll} 
        />
        <label>Select All</label>
                {cart.map((cart)=>(
                    <div key={cart.id}>
                    <li>
                        <h3><input 
    type="checkbox" 
    checked={selectedItems.includes(cart.id)}
    onChange={() => handleSelect(cart.id)}
/>{cart.Book.title}</h3>
                        <h3>{cart.Book.author}</h3>
                        <h3>{cart.Book.price}</h3>
                    </li>
    </div>
            ))}
            <h3>Total:{totalPrice}</h3>
            <button onClick={deleteItems}>Delete</button>
            <button onClick={handleCheckout}>Checkout</button>
            </>
        )}
            </div>
);
}

export default Cart;