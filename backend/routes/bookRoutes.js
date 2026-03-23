const express=require("express");
const auth=require("../middlewares/authMiddleware");
const router=express.Router();
const {addBook,getAllBooks,getBookbyId,editBook,getMyBooks,getBooksBySeller,deleteBook}=require("../controllers/bookController");

router.post('/add-book',auth,addBook);
router.get('/get-all',getAllBooks);
router.put('/edit-book/:id',auth,editBook);
router.get('/my-books',auth,getMyBooks);
router.get('/seller/:sellerId',getBooksBySeller);
router.delete('/delete/:id',auth,deleteBook);
router.get('/:id',getBookbyId);

module.exports=router;
