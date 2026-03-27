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
    
            return res.status(200).json({book});
        }

    } catch (error) {
        return res.status(500).json({message:"Server error on order"});
    }
}