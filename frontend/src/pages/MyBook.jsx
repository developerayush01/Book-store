import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import {useAuth} from '../context/AuthContext'
import { useNavigate} from "react-router-dom";

function MyBook() {
    const [book, setBook] = useState([]);
    const [AddBookFormData,setAddBookFormData]=useState({
      title:"",
      author:"",
      price:"",
      condition:"",
      description:""
    });
    const[showBookForm,setshowBookForm]=useState(false);
  const [error,setError] = useState("");
  const navigate = useNavigate();
  const {user}=useAuth();

useEffect(() => {
    if(!user) {
        navigate("/login");
    }
}, [user,navigate]);

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
  
  
  const addBook=async(AddBookFormData)=>{
      try {
        await axiosInstance.post("/api/books/add-book",AddBookFormData);
        const response=await axiosInstance.get("/api/books/my-books");

        setBook(response.data.books);
        setshowBookForm(false);
        setAddBookFormData({title:"",
      author:"",
      price:"",
      condition:"",
      description:""});
      } catch (error) {
        alert("Could not add book");
      }
    };
  
    const handleDeleteBook=async(book_id)=>{
      try {
        await axiosInstance.delete(`api/books/delete/${book_id}`);
        const response=await axiosInstance.get("/api/books/my-books");
        setBook(response.data.books);
      } catch (error) {
        alert("Could not delete book");
      }
    }
return (
    <div>
            {!book || book.length===0 ? (
              <>
              <p>No books listed yet</p>
              <button onClick={()=>{setshowBookForm(true)}}>Add Book</button>
              </>
            ) : (
                book.map((book)=>(
                <div key={book.id}>
                        <h3>{book.title}</h3>
          <p>{book.author}</p>
          <p>{book.price}</p>
          <button>Edit</button>
    <button>Delete</button>
    <button onClick={()=>{setshowBookForm(true)}}>Add Book</button>
    </div>
                ))
            )}

            {showBookForm && (
              <div>
                <p>Add New Book</p>
                <input 
    value={AddBookFormData.title}
    onChange={(e) => setAddBookFormData({ ...AddBookFormData, title: e.target.value })}
    placeholder="Enter title"/>
    <input 
    value={AddBookFormData.author}
    onChange={(e) => setAddBookFormData({ ...AddBookFormData, author: e.target.value })}
    placeholder="Enter author"/>
    <input 
    value={AddBookFormData.price}
    onChange={(e) => setAddBookFormData({ ...AddBookFormData, price: e.target.value })}
    placeholder="Enter price"/>
    <input 
    value={AddBookFormData.condition}
    onChange={(e) => setAddBookFormData({ ...AddBookFormData, condition: e.target.value })}
    placeholder="Enter condition"/>
    <input 
    value={AddBookFormData.description}
    onChange={(e) => setAddBookFormData({ ...AddBookFormData, description: e.target.value })}
    placeholder="Enter description"/>
    <button onClick={()=>{addBook(AddBookFormData)}}>Save</button>
    <button onClick={()=>{setshowBookForm(false)}}>Cancel</button>
              </div>
            )}
            </div>
);
}
export default MyBook;