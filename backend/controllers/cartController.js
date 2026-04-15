const Book=require("../models/bookModel");
const User=require("../models/userModel");
const Cart=require("../models/cartModel");

const addCart=async(req,res)=>{
    try {
        const{book_id}=req.body;
        const user=req.user.userId;
        if(!user)
        {
            return res.status(403).json({message:"You have to login first"});
        }

        const book=await Book.findOne({where:{id:book_id}});
        if(!book)
        {
            return res.status(404).json({message:"Book not available"});
        }

        const cartBook=await Cart.findOne({where:{user_id:user,book_id:book_id}})

        if(cartBook)
        {
            return res.status(200).json({message:"Book is already in the cart"})
        }
        const cartItems=await Cart.create({
            user_id:user,
            book_id,
            expiresAt:new Date(Date.now() + 24 * 60 * 60 * 1000)
        })
        return res.status(201).json({message:"Added to cart succesfully"});
    } catch (error) {
        return res.status(500).json("Server error on add to cart");
    }

}

module.exports={addCart};