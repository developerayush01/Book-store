import {useNavigate,Link} from 'react-router-dom'
import {useState} from 'react'
import {useAuth} from '../context/AuthContext'
import axiosInstance from '../api/axios'

function AddBook() {
    const [error, setError] = useState("");
    const [title,setTitle]=useState("");
    const [author,setAuthor]=useState("");
    const [price,setPrice]=useState("");
    const [condition,setCondition]=useState("");
    const [description,setDescription]=useState("");

    const addBook=async()=>{
        try {
            await axiosInstance.post("/api/books/add-book",{title,author,price,condition,description});
            alert("Book added succesfully")
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    return (
        <>
        <h2>Add-book</h2>
        <div>
    <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='Enter Title'/>
    <input type="text" value={author} onChange={(e)=>setAuthor(e.target.value)} placeholder='Enter Author name'/>
    <input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} placeholder='Enter Price'/>
    <input type="text" value={condition} onChange={(e)=>setCondition(e.target.value)} placeholder='Book condition'/>
    <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder='Description'/>
        <br></br>
        <button onClick={addBook}>Add Book</button>
        </div>
    </>);
}
export default AddBook;