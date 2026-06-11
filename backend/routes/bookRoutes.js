const express=require("express");
const multer = require("multer");
const auth=require("../middlewares/authMiddleware");
const router=express.Router();
const {addBook,uploadBookImages,getAllBooks,getBookbyId,editBook,getMyBooks,getBooksBySeller,deleteBook}=require("../controllers/bookController");
const upload = multer({ storage: multer.memoryStorage() });
router.post('/add-book',auth,addBook);
router.post(
    "/upload-images",
    auth,                          
    upload.array("bookImages", 5), 
    uploadBookImages              
);
router.get('/get-all',getAllBooks);
router.put('/edit-book/:id',auth,editBook);
router.get('/my-books',auth,getMyBooks);
router.get('/seller/:sellerId',getBooksBySeller);
router.delete('/delete/:id',auth,deleteBook);
router.get('/:id',getBookbyId);

module.exports=router;
