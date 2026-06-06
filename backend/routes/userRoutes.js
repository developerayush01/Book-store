const express=require("express");
const auth=require("../middlewares/authMiddleware");
const router=express.Router();
const {registerUser,loginUser,getProfile,logOut, editProfile}=require("../controllers/userController");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",auth,getProfile);
router.get("/profile/edit-profile",auth,editProfile);
router.post("/logout",auth,logOut);

module.exports=router;