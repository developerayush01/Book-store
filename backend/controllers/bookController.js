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

const editBook=async(req,res)=>{

    try {
        const bookId=req.params.id;

        if(!bookId)
        {
            return res.status(404).json({message:"Book not found"});
        }

        const seller_id=req.user.userId;
        const book=await Book.findOne({where:{id:bookId}});
        if(!book) {
    return res.status(404).json({ message: "Book not found" });
}

        if(book.seller_id!==seller_id)
        {
            return res.status(403).json({message:"Not authourized to edit this book"})
        }

        const updatedBook=req.body;
        await book.update(updatedBook);
        return res.status(200).json({message:"Book updated succesfully"});


    } catch (error) {
        return res.status(500).json({message:"Server error on book update"});
    }

}

const getMyBooks=async(req,res)=>{

    try {
        
        const loggedId=req.user.userId;
        if(!loggedId)
            {
                return res.status(401).json({message:"You are not logged in"});
            }
            const books=await Book.findAll({where:{seller_id:loggedId}});

            if(books.length===0)
            {
                return res.status(200).json({message:"No books listed"});
            }
        return res.status(200).json({books});


    } catch (error) {
        return res.status(500).json({message:"Server error on getmybook"});
    }

}

const getBooksBySeller=async(req,res)=>{

    try {
        const sellerId=req.params.id;
        if(!sellerId)
        {
            return res.status(404).json({message:"Seller not found"});
        }
        const books=await Book.findAll({where:{seller_id:sellerId}});

        if(books.length===0)
        {
            return res.status(200).json({message:"No books found"})
        }

        return res.status(200).json({books});

    } catch (error) {
        return res.status(500).json({message:"Server error on getbookbyseller"});
    }
}

const deleteBook=async(req,res)=>{

    try {
        const loggedIn=req.user.userId;
        const bookId=req.params.id;

        if(!bookId) {
    return res.status(400).json({ message: "Book ID is required" });
}

        if(!loggedIn)
        {
            return res.status(401).json({message:"You are not logged in"});
        }

        const book=await Book.findOne({where:{id:bookId}});

        
        if(!book)
            {
                return res.status(404).json({message:"Book not found"});
            }

            if(book.seller_id!==loggedIn)
            {
                return res.status(403).json({message:"Not authorized to delete"});
            }
            await book.destroy();
return res.status(200).json({ message: "Book deleted successfully" });

    } catch (error) {
        return res.status(500).json({message:"Server error"});
    }

}
module.exports={addBook,getAllBooks,getBookbyId,getMyBooks,getBooksBySeller};

