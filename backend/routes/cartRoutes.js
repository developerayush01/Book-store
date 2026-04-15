const express=require("express");
const auth=require("../middlewares/authMiddleware");
const router=express.Router();
const {addCart}=require("../controllers/cartController")

router.post("/add-cart",auth,addCart);

module.exports=router;