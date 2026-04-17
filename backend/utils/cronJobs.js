const cron=require("node-cron");
const Cart=require("../models/cartModel");
const Book=require("../models/bookModel");
const {Op}=require("sequelize");

cron.schedule("0 * * * *",async()=>{
    try {
        const expiredItems=await Cart.findAll({
            where:{
                expiresAt:{[Op.lt]:new Date()}
            }
        });

        for (const item of expiredItems)
        {
            await Book.update(
                {status:"Available"},
                {where:{id:item.book_id}}
            );

            await item.destroy();
        }

        console.log("Expired cart items cleaned up");
        
    } catch (error) {
        console.log("Cron error:", error);
    }
})