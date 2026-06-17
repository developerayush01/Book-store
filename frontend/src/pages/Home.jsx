import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Home() {
  const [book, setBook] = useState([]);
  const [error,setError] = useState("");
  const {user}=useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get("api/books/get-all");
        setBook(response.data.book);
      } catch (error) {
        setError(error.response.data.message || "Something went wrong");
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h2>All Books</h2>
      { book && book.length === 0 ? (
    <p>No books available</p>
) : (
      book && book.filter(b => b.seller_id !== user?.id).map((book) => (
        <>
        <div key={book.id}>
          <img
  src={`https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public/book-covers/${book.id}/cover.jpg`}
  alt={book.title}
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
/>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <p>{book.price}</p>
          <Link to={`/books/${book.id}`}>View Details</Link>
        </div>
        <br></br>
        </>
      ))
  )}
  </div>
  );
}
export default Home;
