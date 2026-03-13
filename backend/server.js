require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser=require("cookie-parser");
const userRoutes=require("./routes/userRoutes")

const { connectDB } = require("./config/db"); // import your DB connection

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Connect to database first


// Main Routes

app.use("/api/users",userRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});