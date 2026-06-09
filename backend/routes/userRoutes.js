const express=require("express");
const multer = require("multer");
const auth=require("../middlewares/authMiddleware");
const router=express.Router();
const {registerUser,loginUser,getProfile,logOut, editProfile, changePassword}=require("../controllers/userController");

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",auth,getProfile);
router.put("/profile/edit-profile",auth,editProfile);
router.put("/profile/edit-profile/change-password",auth,changePassword);
router.post("/logout",auth,logOut);
router.post(
    "/upload-profile-picture",
    auth,                           
    upload.single("profilePicture"), 
    uploadProfilePicture           
);

module.exports=router;