const book=require("../models/bookModel");
const User=require("../models/userModel");
const seller_id=req.user.userId;

const addBook=(req,res)=>{

    try {
        
        if(!seller_id)
        {
            return res.status(201).json({message:"Seller nor found"})
        }

        


    } catch (error) {
        
    }

}

