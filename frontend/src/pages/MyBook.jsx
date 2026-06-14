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
    const [showEditForm,setshowEditForm]=useState(false);
    const [EditBook,setEditBook]=useState(null);

    const [EditFormData,setEditFormData]=useState({
      title: "",
    author: "",
    price: "",
    condition: "",
    description: ""
    });
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
  
    const handleEdit=(bookEdit)=>{
      setEditBook(bookEdit);
      setEditFormData({
        title: bookEdit.title,
        author: bookEdit.author,
        price: bookEdit.price,
        condition: bookEdit.condition,
        description: bookEdit.description
      });
      setshowEditForm(true);
    }

    const handleUpdate=async()=>{
      try{
      await axiosInstance.put(`/api/books/edit-book/${EditBook.id}`,EditFormData);

       const response = await axiosInstance.get("/api/books/my-books");
        setBook(response.data.books);

        setshowEditForm(false);
      }
       catch(error) {
        alert("Could not update book");
    }
    }
    
    const handleDeleteBook=async(book_id)=>{
      try {
        await axiosInstance.delete(`/api/books/delete/${book_id}`);
        
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
              <>
                {book.map((book)=>(
                <div key={book.id}>
                        <h3>{book.title}</h3>
          <p>{book.author}</p>
          <p>{book.price}</p>
          <button onClick={() => navigate(`/edit-book//${book.id}`)}>Edit</button>
    <button onClick={()=>handleDeleteBook(book.id)}>Delete</button>
    <br />
    </div>
  ))}
            <button onClick={()=>navigate("/add-book")}>Add Book</button>
  </>

)}
            </div>
);
}
export default MyBook;