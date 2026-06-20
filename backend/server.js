require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser=require("cookie-parser");
const userRoutes=require("./routes/userRoutes")
const bookRoutes=require("./routes/bookRoutes");
const orderRoutes=require("./routes/orderRoutes");
const cartRoutes=require("./routes/cartRoutes");
const addressRoutes=require("./routes/addressRoutes");
const paymentRoutes = require("./routes/paymentRoute");

require("./utils/cronJobs");

const { connectDB } = require("./config/db"); // import your DB connection

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://book-store-five-xi-70.vercel.app/"
  ],
  credentials: true
}));
app.use(cookieParser());
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Connect to database first


// Main Routes

app.use("/api/users",userRoutes);
app.use("/api/books",bookRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/address",addressRoutes);
app.use("/api/payment", paymentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
