const Order=require('../models/orderModel');
const Book=require("../models/bookModel");

const createOrder=async(req,res)=>{

    try {
        const loggedId=req.user.userId;
        if(!loggedId)
        {
            return res.status(401).json({message:"Please login first"});
        }
        const {bookIds}=req.body;

        let totalPrice=0;
        for(const bookId of bookIds)
        {

            const book=await Book.findOne({where:{id:bookId}});
            if(!book)
            {
                return res.status(404).json({message:"Book not found"});
            }
    
            if(book.status=="Sold")
            {
                return res.status(400).json({message:"Book is already sold"});
            }
            totalPrice+=book.price;
        }
        const order=await Order.create({
            buyer_id:loggedId,
            total_price:totalPrice,
            status:"pending"
        });
        

    } catch (error) {
        return res.status(500).json({message:"Server error on order"});
    }
}