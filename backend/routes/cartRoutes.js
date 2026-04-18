const express=require("express");
const auth=require("../middlewares/authMiddleware");
const router=express.Router();
const {addCart,myCart,removeCart,removeAllCart}=require("../controllers/cartController")

router.post("/add-cart",auth,addCart);
router.get("/my-cart",auth,myCart);
router.delete("/delete/:id",auth,removeCart);
router.delete("/delete-all",auth,removeAllCart);

module.exports=router;