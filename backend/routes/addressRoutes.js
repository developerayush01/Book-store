const express=require("express");
const auth=require("../middlewares/authMiddleware");
const router=express.Router();
const {addAddress}=require("../controllers/addressController");

router.post("/add-address",auth,addAddress);

module.exports=router;