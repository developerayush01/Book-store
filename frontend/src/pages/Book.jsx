import { useParams,useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosInstance from '../api/axios'
import useAuth from '../context/AuthContext'

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
        if (!user){
            navigate("/login");
            return;

        }
        const response=await axiosInstance.post()
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
                </>
            ) : (
                <p></p>
            )}
        </div>
);
}


export default Book;