import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Book from "./pages/Book";
import AddBook from "./pages/AddBook";
import MyBook from "./pages/MyBook";
import MyOrder from "./pages/MyOrder";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";

function App() {

  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/profile" element={<Profile/>}/>
<Route path="/books/:id" element={<Book/>}/>
<Route path="/my-books" element={<MyBook/>}/>
<Route path="/add-book" element={<AddBook/>}/>
<Route path="/my-orders" element={<MyOrder/>}/>
<Route path="/my-cart" element={<Cart/>}/>
<Route path="/checkout" element={<Checkout/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;
