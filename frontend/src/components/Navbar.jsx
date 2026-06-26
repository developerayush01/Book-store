import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import axiosInstance from "../api/axios";
import { FaHome, FaUser, FaClipboardList, FaShoppingCart, FaSignOutAlt, FaSignInAlt, FaBook, FaChevronDown, FaStore,FaEllipsisH } from "react-icons/fa";

function Navbar() {
    const { user, setUser, mode, setMode } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
    const [guestProfileOpen, setGuestProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMoreRef = useRef(null);
    const guestProfileRef = useRef(null);

    const handleLogout = async () => {
        try {
            await axiosInstance.post("api/users/logout");
            setUser("");
            navigate("/");
        } catch (error) {
            alert("Logout failed");
        }
    };

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
  function handleClickOutside(e) {
    if (
      mobileMoreRef.current &&
      !mobileMoreRef.current.contains(e.target)
    ) {
      setMobileMoreOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("touchstart", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("touchstart", handleClickOutside);
  };
}, []);


    const Toggle = () => (
        <div className="flex items-center bg-slate-700 rounded-lg p-0.5 text-xs">
            <button
                onClick={() => setMode("buyer")}
                className={`px-3 py-1 rounded-md transition font-medium ${mode === "buyer" ? "bg-amber-700 text-white" : "text-gray-300 hover:text-white"}`}
            >
                Buyer
            </button>
            <button
                onClick={() => setMode("seller")}
                className={`px-3 py-1 rounded-md transition font-medium ${mode === "seller" ? "bg-amber-700 text-white" : "text-gray-300 hover:text-white"}`}
            >
                Seller
            </button>
        </div>
    );

    return (
    <>
        {/* ===== DESKTOP NAVBAR ===== */}
        <nav className="hidden md:flex justify-between items-center px-8 py-4 bg-slate-800 text-white shadow-md border-b border-slate-600 fixed top-0 left-0 right-0 z-50">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2">
                <div className="bg-amber-700 p-2 rounded-lg">
                    <FaBook size={16} className="text-white" />
                </div>
                <span className="text-xl font-bold tracking-wide">
                    Books <span className="text-amber-400">Deal</span>
                </span>
            </Link>

            {/* LINKS */}
            <div className="flex items-center gap-6">

                {user ? (
                    <>
                        {/* TOGGLE */}
                        <Toggle />

                        {/* PROFILE DROPDOWN */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg text-sm transition"
                            >
                                <FaUser size={12} />
                                {user.name}
                                <FaChevronDown
                                    size={10}
                                    className={`transition-transform duration-200 ${
                                        dropdownOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">

                                    {/* BUYER MENU */}
                                    {mode === "buyer" && (
                                        <>
                                            <Link
                                                to="/my-cart"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition"
                                            >
                                                <FaShoppingCart
                                                    size={12}
                                                    className="text-gray-400"
                                                />
                                                My Cart
                                            </Link>

                                            <Link
                                                to="/my-orders"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition"
                                            >
                                                <FaBook
                                                    size={12}
                                                    className="text-gray-400"
                                                />
                                                My Orders
                                            </Link>
                                        </>
                                    )}

                                    {/* SELLER MENU */}
                                    {mode === "seller" && (
                                        <>
                                            <Link
                                                to="/my-books"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition"
                                            >
                                                <FaBook
                                                    size={12}
                                                    className="text-gray-400"
                                                />
                                                My Books
                                            </Link>

                                            <Link
                                                to="/my-sales"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition"
                                            >
                                                <FaStore
                                                    size={12}
                                                    className="text-gray-400"
                                                />
                                                My Sales
                                            </Link>
                                        </>
                                    )}

                                    <div className="border-t border-gray-100" />

                                    <Link
                                        to="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition"
                                    >
                                        <FaUser
                                            size={12}
                                            className="text-gray-400"
                                        />
                                        Visit Profile
                                    </Link>

                                    <Link
                                        to="/profile/edit"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50 transition"
                                    >
                                        <FaBook
                                            size={12}
                                            className="text-gray-400"
                                        />
                                        Edit Profile
                                    </Link>

                                    <div className="border-t border-gray-100" />

                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setDropdownOpen(false);
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                                    >
                                        <FaSignOutAlt size={12} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="text-sm text-gray-300 hover:text-white transition"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="bg-amber-700 hover:bg-amber-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>

        {/* ===== MOBILE BOTTOM NAV ===== */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 text-white flex justify-around items-center py-3 border-t border-slate-700 z-50">

  <Link
    to="/"
    className={`flex flex-col items-center text-xs gap-1 ${
      isActive("/") ? "text-amber-400" : "text-gray-400"
    }`}
  >
    <FaHome size={20} />
    Home
  </Link>

  {!user ? (
    <Link
      to="/login"
      className={`flex flex-col items-center text-xs gap-1 ${
        isActive("/login") ? "text-amber-400" : "text-gray-400"
      }`}
    >
      <FaSignInAlt size={20} />
      Login
    </Link>
  ) : (
    <>
      {mode === "buyer" ? (
        <Link
          to="/my-cart"
          className={`flex flex-col items-center text-xs gap-1 ${
            isActive("/my-cart") ? "text-amber-400" : "text-gray-400"
          }`}
        >
          <FaShoppingCart size={20} />
          Cart
        </Link>
      ) : (
        <Link
          to="/my-books"
          className={`flex flex-col items-center text-xs gap-1 ${
            isActive("/my-books") ? "text-amber-400" : "text-gray-400"
          }`}
        >
          <FaBook size={20} />
          My Books
        </Link>
      )}

      <Link
        to="/profile"
        className={`flex flex-col items-center text-xs gap-1 ${
          isActive("/profile") ? "text-amber-400" : "text-gray-400"
        }`}
      >
        <FaUser size={20} />
        Profile
      </Link>

      <div className="relative" ref={mobileMoreRef}>
        <button
          onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
          className="flex flex-col items-center text-xs gap-1 text-gray-400"
        >
          <FaEllipsisH size={20} />
          More
        </button>

        {mobileMoreOpen && (
  <div className="absolute bottom-16 right-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">

    {/* TOGGLE */}
    <div className="flex items-center justify-center gap-1 p-3 border-b border-gray-100">
      <button
        onClick={() => setMode("buyer")}
        className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${mode === "buyer" ? "bg-amber-700 text-white" : "text-gray-500 hover:bg-gray-100"}`}
      >
        Buyer
      </button>
      <button
        onClick={() => setMode("seller")}
        className={`flex-1 py-1.5 rounded-md text-xs font-medium transition ${mode === "seller" ? "bg-amber-700 text-white" : "text-gray-500 hover:bg-gray-100"}`}
      >
        Seller
      </button>
    </div>

    {mode === "buyer" ? (
      <Link
        to="/my-orders"
        onClick={() => setMobileMoreOpen(false)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50"
      >
        <FaClipboardList size={12} className="text-gray-400" />
        My Orders
      </Link>
    ) : (
      <>
        <Link
          to="/my-sales"
          onClick={() => setMobileMoreOpen(false)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50"
        >
          <FaStore size={12} className="text-gray-400" />
          My Sales
        </Link>
        <Link
          to="/add-book"
          onClick={() => setMobileMoreOpen(false)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-gray-50"
        >
          <FaBook size={12} className="text-gray-400" />
          Add Book
        </Link>
      </>
    )}

    <div className="border-t border-gray-100" />

    <button
      onClick={() => { handleLogout(); setMobileMoreOpen(false); }}
      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
    >
      <FaSignOutAlt size={12} />
      Logout
    </button>

  </div>
)}
      </div>
    </>
  )}
</div>


    </>
);
}

export default Navbar;