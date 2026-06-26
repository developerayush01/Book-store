import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import Book from "./pages/Book";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import MyBook from "./pages/MyBook";
import MyOrder from "./pages/MyOrder";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Verification from "./pages/Verification";
import MySales from "./pages/MySales";

function App() {

  return (
    <BrowserRouter>
    <Navbar/>
    <div className="pb-16 md:pb-0 md:pt-16">
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/verify" element={<Verification />} />
      <Route path="/register" element={<Register/>}/>
      <Route path="/profile" element={<Profile/>}/>
<Route path="/profile/edit" element={<EditProfile/>}/>
<Route path="/profile/edit/change-password" element={<ChangePassword/>}/>
<Route path="/books/:id" element={<Book/>}/>
<Route path="/my-books" element={<MyBook/>}/>
<Route path="/add-book" element={<AddBook/>}/>
<Route path="/edit-book/:bookId" element={<EditBook/>}/>
<Route path="/my-orders" element={<MyOrder/>}/>
<Route path="/my-sales" element={<MySales/>}/>
<Route path="/my-cart" element={<Cart/>}/>
<Route path="/checkout" element={<Checkout/>}/>
<Route path="/payment/success" element={<PaymentSuccess />} />
<Route path="/payment/failed" element={<PaymentFailed />} />
    </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App;
