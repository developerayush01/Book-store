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
          <button onClick={()=>handleEdit(book)}>Edit</button>
    <button onClick={()=>handleDeleteBook(book.id)}>Delete</button>
    <br />
    </div>
  ))}
            <button onClick={()=>{setshowBookForm(true)}}>Add Book</button>
  </>

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

            {showEditForm && (
              <div>
                <input 
    value={EditFormData.title}
    onChange={(e) => setEditFormData({ ...EditFormData, title: e.target.value })}
    placeholder="Enter title"/>
    <input 
    value={EditFormData.author}
    onChange={(e) => setEditFormData({ ...EditFormData, author: e.target.value })}
    placeholder="Enter author"/>
    <input 
    value={EditFormData.price}
    onChange={(e) => setEditFormData({ ...EditFormData, price: e.target.value })}
    placeholder="Enter price"/>
    <input 
    value={EditFormData.condition}
    onChange={(e) => setEditFormData({ ...EditFormData, condition: e.target.value })}
    placeholder="Enter condition"/>
    <input 
    value={EditFormData.description}
    onChange={(e) => setEditFormData({ ...EditFormData, description: e.target.value })}
    placeholder="Enter description"/>
    <button onClick={handleUpdate}>Save</button>
    <button onClick={()=>{setshowEditForm(false)}}>Cancel</button>
              </div>
            )}
            </div>
);
}
export default MyBook;