const Order=require('../models/orderModel');
const Book=require("../models/bookModel");

const createOrder=async(req,res)=>{

    try {
        const loggedId=res.user.userId;
        if(!loggedId)
        {
            return res.status(401).json({message:"Please login first"});
        }
        const {book_id}=req.body;

        const book=await Book.findOne({where:{id:book_id}})
        
        if(!book)
        {
            return res.status(404).json({message:"Book not found"});
        }

        if(book.status=="Unavailable")
        {
            return res.status(400).json({message:"Book is already sold"});
        }

        return res.status(200).json({book});

    } catch (error) {
        
    }

}