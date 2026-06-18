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
    <div className="min-h-screen bg-[#F7F3EC] py-10 px-4">

  <div className="max-w-5xl mx-auto">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-bold text-slate-800">
        My Books
      </h2>

      <button
        onClick={() => navigate("/add-book")}
        className="bg-slate-800 text-white px-4 py-2 rounded text-sm hover:bg-slate-700"
      >
        + Add Book
      </button>

    </div>

    {/* EMPTY STATE */}
    {!book || book.length === 0 ? (
      <div className="text-center mt-20">

        <p className="text-gray-500 mb-4">
          No books listed yet
        </p>

        <button
          onClick={() => setshowBookForm(true)}
          className="bg-slate-800 text-white px-4 py-2 rounded text-sm"
        >
          Add Your First Book
        </button>

      </div>

    ) : (
      <div className="flex flex-col gap-4">

        {book.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
          >

            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">

              {/* Cover */}
              <img
                src={`https://ufxkxqgfvlvaufeqghuw.supabase.co/storage/v1/object/public/book-covers/${book.id}/cover.jpg`}
                alt={book.title}
                className="w-14 h-16 object-cover rounded bg-gray-200"
              />

              {/* INFO */}
              <div>
                <h3 className="font-semibold text-gray-800">
                  {book.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {book.author}
                </p>

                <p className="text-blue-600 font-bold text-sm">
                  Rs {book.price}
                </p>
              </div>

            </div>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex gap-2">

              <button
                onClick={() => navigate(`/edit-book/${book.id}`)}
                className="px-3 py-1 text-xs border border-blue-500 text-blue-600 rounded hover:bg-blue-50"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteBook(book.id)}
                className="px-3 py-1 text-xs border border-red-500 text-red-600 rounded hover:bg-red-50"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>
    )}

  </div>
</div>
);
}
export default MyBook;