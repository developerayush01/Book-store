import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosInstance from '../api/axios'

function Book() {
    const { id } = useParams();
    const [book,setBook]=useState(null);

    useEffect(()=>{
        const fetchBook=async()=>{
                try {
                const response=await axiosInstance.get(`/api/books/${id}`);
                setBook(response.data);

            } catch (error) {

            }
            
        }
        fetchBook();
    },[id]);

    return (
     <div>
            {book ? (
                <>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <p>{book.price}</p>
                    <p>{book.condition}</p>
                </>
            ) : (
                <p></p>
            )}
        </div>
);
}


export default Book;