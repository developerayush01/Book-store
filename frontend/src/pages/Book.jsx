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
            navigate("/login", { state: { from: `/books/${id}` } });
            return;
        }
       
        navigate("/checkout", { 
    state: { 
        selectedCartItems: [{ Book: book, book_id: id }]
    } 
});
    }            
         catch (error) {
            alert("Server error");
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


const SUPABASE_URL =
  "https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public";

const coverImageUrl =
  `${SUPABASE_URL}/book-covers/${id}/cover.jpg`;

const otherImages = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  url: `${SUPABASE_URL}/book-images/books/${id}/image-${i + 1}.jpg`,
}));


return (
     <div>
            {book ? (
                <>
                <img
  src={coverImageUrl}
  alt="Cover"
  style={{
  width: "150px",
  height: "150px",
  borderRadius: "15%",
  background: "#e9ecef",
  display: "flex",
  alignItems: "start",
  justifyContent: "start",
  fontSize: "60px",
  margin: "0 0 15px 0",
  color: "#6c757d"
}}
  onError={(e) => {
    e.target.style.display = "none";
    
  }}
/>
<div style={{ display: "flex", gap: "10px" }}>
  {otherImages.map((img) => (
    <img
      key={img.id}
      src={img.url}
      alt={`Book ${img.id}`}
      width={80}
      onError={(e) => {
        e.target.style.display = "none";
      }}
    />
  ))}
</div>
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