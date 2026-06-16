const express=require("express");
const multer = require("multer");
const auth=require("../middlewares/authMiddleware");
const router=express.Router();
const {addBook,uploadBookImages,uploadCoverImage,deleteCoverImage,deleteBookImage,getAllBooks,getBookbyId,editBook,getMyBooks,getBooksBySeller,deleteBook}=require("../controllers/bookController");
const upload = multer({ storage: multer.memoryStorage() });
router.post('/add-book',auth,addBook);
router.post(
    "/upload-images",
    auth,
    upload.single("bookImages"),
    uploadBookImages
);
router.post(
    "/upload-cover",
    auth,
    upload.single("coverImage"),
    uploadCoverImage
);
router.delete(
    "/delete-image/:imageId",
    auth,
    deleteBookImage
);
router.get('/get-all',getAllBooks);
router.put('/edit-book/:id',auth,editBook);
router.get('/my-books',auth,getMyBooks);
router.get('/seller/:sellerId',getBooksBySeller);
router.delete('/delete/:id',auth,deleteBook);
router.get('/:id',getBookbyId);

module.exports=router;
