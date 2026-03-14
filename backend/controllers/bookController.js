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

const getAllBooks=async(req,res)=>{
    try {
        const book=await Book.findAll({where:{status:"Available"}});
        if(book.length===0)
        {
            return res.status(200).json({message:"No books available"});
        }

        return res.status(200).json({book});
    } catch (error) {
          return res.status(500).json("Server error on get All books");
    }


}

const getBookbyId=async(req,res)=>{

    try {
        
        const bookId=req.params.id;
        if(!bookId)
            {
                return res.status(404).json({message:"Book not found"});
            }
            
            const bookData=await Book.findOne({where:{id:bookId}});
            if(!bookData)
            {
                return res.status(404).json({message:"Data not found"});
            }
        return res.status(200).json(bookData);

    } catch (error) {
        return res.status(500).json({message:"Server error on GetbookbyId"});
    }

}
module.exports={addBook,getAllBooks,getBookbyId};

