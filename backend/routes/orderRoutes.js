const express=require("express");
const auth=require("../middlewares/authMiddleware");
const router=express.Router();
const {createOrder,getMyOrder,getOrderById,getMySales}=require("../controllers/orderController");

router.post('/create-order',auth,createOrder);
router.get('/my-order',auth,getMyOrder);
router.get('/my-sales',auth,getMySales);
router.get('/:id',auth,getOrderById);
module.exports=router;
