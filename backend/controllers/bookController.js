const Book=require("../models/bookModel");
const User=require("../models/userModel");
const {Op}=require("sequelize");

const addBook=async(req,res)=>{
    
    try {
        const seller_id=req.user.userId;
        if(!seller_id)
        {
            return res.status(401).json({message:"Seller nor found"})
        }
        const {title,author,price,condition,description}=req.body;
        const normalizedTitle=title.trim().toLowerCase();
        
        const check=await Book.findOne({
            where:{
                seller_id:req.user.userId,
            title:{[Op.iLike]:normalizedTitle}
        }
    });

        if(check)
        {
            return res.status(400).json({message:"Book exists already"})
        }


        const book=await Book.create({
            title,
            author,
            price,
            condition,
            description,
            seller_id
        });

        return res.status(201).json({message:"Book added succesfully"});

    } catch (error) {
        
        return res.status(500).json("Server error");
    }

}

module.exports={addBook};

