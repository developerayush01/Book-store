import { useParams,useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosInstance from '../api/axios'
import {useAuth} from '../context/AuthContext'

function Book() {
    const { id } = useParams();
    const [book,setBook]=useState(null);
    const navigate = useNavigate();
const { user } = useAuth();

    useEffect(()=>{
        const fetchBook=async()=>{
                try {
                const response=await axiosInstance.get(`/api/books/${id}`);
                setBook(response.data);

            } catch (error) {
                alert("Something went wrong");
            }
            
        }
        fetchBook();
    },[id]);

    const handleBuy=async()=>{
        try {
            if (!user){
            navigate("/login");
            return;
        }
        await axiosInstance.post("/api/orders/create-order",{bookIds:[id]});
        navigate("/orders");
    }            
         catch (error) {
            alert("Order failed!");
        }
};

const handleCart=async()=>{
    try {
        if (!user){
            navigate("/login");
            return;
        }
        await axiosInstance.post("/api/cart/add-cart",{book_id:id});
        alert("Added to Cart Succesfully");
 } catch (error) {
        alert("Cannot add to cart");
    }
}

return (
     <div>
            {book ? (
                <>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <p>{book.price}</p>
                    <p>{book.condition}</p>
                    <button onClick={handleBuy}>Buy Now</button>
                    <button onClick={handleCart}>Add to Cart</button>
                </>
            ) : (
                <p></p>
            )}
        </div>
);
}

export default Book;