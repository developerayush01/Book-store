const express=require("express");
const auth=require("../middlewares/authMiddleware");
const router=express.Router();
const {createOrder,getMyOrder}=require("../controllers/orderController");

router.post('/create-order',auth,createOrder);
router.get('/my-order',auth,getMyOrder);

module.exports=router;
