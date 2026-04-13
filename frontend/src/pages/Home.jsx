import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";

function Home() {
  const [book, setBook] = useState([]);
  const [setError] = useState("");

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
      {book.map((book) => (
        <div key={book.id}>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <p>{book.price}</p>
          <Link to={`/books/${book.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}
export default Home;
