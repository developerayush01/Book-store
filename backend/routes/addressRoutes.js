const express=require("express");
const auth=require("../middlewares/authMiddleware");
const router=express.Router();
const {addAddress,getAddress,setDefault,deleteAddress}=require("../controllers/addressController");

router.post("/add-address",auth,addAddress);
router.get("/my-address",auth,getAddress);
router.update("/set-default/:id",auth,setDefault);
router.delete("/delete/:id",auth,addAddress);

module.exports=router;