import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import {useAuth} from '../context/AuthContext'
import { useNavigate} from "react-router-dom";

function MyBook() {
    const [book, setBook] = useState([]);
  const [error,setError] = useState("");
  const navigate = useNavigate();
  const {user}=useAuth();

useEffect(() => {
    if(!user) {
        navigate("/login");
    }
}, [user]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get("/api/books/my-books");
        setBook(response.data.books);
      } catch (error) {
        setError(error.response.data.message || "Something went wrong");
      }
    };
    fetchBooks();
  }, []);

return (
    <div>
            {!book || book.length===0 ? (
              <>
              <p>No books listed yet</p>
              <button>Add Book</button>
              </>
            ) : (
                book.map((book)=>(
                <div key={book.id}>
                        <h3>{book.title}</h3>
          <p>{book.author}</p>
          <p>{book.price}</p>
          <button>Edit</button>
    <button>Delete</button>
    <button>Add Book</button>
    </div>
                ))
            )}
            </div>
);
}
export default MyBook;