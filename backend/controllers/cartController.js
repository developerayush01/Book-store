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

        if(book.status !== "Available") {
    return res.status(400).json({ message: "Book is not available" });
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
        });
        await book.update({status:"Reserved"});
        return res.status(201).json({message:"Added to cart succesfully"});
        
    } catch (error) {
        return res.status(500).json("Server error on add to cart");
    }

}

const myCart=async(req,res)=>{
    try {
        const user=req.user.userId;
        if(!user)
        {
            return res.status(403).json({message:"You have to login first"});
        }

        const cartItems = await Cart.findAll({
    where: { user_id: user },
    include: [{
        model: Book,
        attributes: ['title', 'author', 'price', 'condition']
    }]
});

        return res.status(200).json({cartItems});
    } catch (error) {
        return res.status(500).json("Server error on view cart");
    }
}

const removeCart=async(req,res)=>{
    try {
        const user=req.user.userId;
        const id=req.params.id;
        const item=await Cart.findOne({where:{id:id}});
        
                if(!user)
                {
                    return res.status(403).json({message:"You have to login first"});
                }
                
                await Cart.destroy({where:{
                    user_id:user,
                    id:id
                }});

                const makeAvailablle=await Book.update(
                {status:"Available"},
                {where:{id:item.book_id}}
            );
                return res.status(200).json({message:"Delete succesful"});
    } catch (error) {
        return res.status(500).json("Server error on deletecart");
    }
}

const removeAllCart=async(req,res)=>{
    try {
        const user=req.user.userId;
        const id=req.params.id;
        const item=await Cart.findAll({where:{user_id:user}});

        const bookIds=item.map(item=>item.book_id);
        
                if(!user)
                {
                    return res.status(403).json({message:"You have to login first"});
                }
        
                await Cart.destroy({where:{
                    user_id:user
                }});

                const makeAvailablle=await Book.update(
                {status:"Available"},
                {where:{id:bookIds}}
            );
                return res.status(200).json({message:"Delete succesful"});
    } catch (error) {
        return res.status(500).json("Server error on deletecart");
    }
}
module.exports={addCart,myCart,removeCart,removeAllCart};