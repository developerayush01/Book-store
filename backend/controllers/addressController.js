const  Address = require("../models/addressModel");
const User=require("../models/userModel");

const addAddress=async(req,res)=>{

    try {
        const user=req.user.userId;
    const {delivery_phone,street,city,district,province}=req.body;

    if(!user)
    {
        return res.status(403).json({message:"NO user"});
    }

    const existingAddress = await Address.findOne({ where: { user_id: user } });
const is_default = !existingAddress;

    await Address.create({
        user_id:user,
        delivery_phone,
        street,
        city,
        district,
        province,
        is_default
    })

    return res.status(201).json({message:"Address added"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Server error on address add"});;
    }
}
    

const deleteAddress=async(req,res)=>{
    try {
        const user=req.user.userId;
        const address=req.params.id
        if(!user)
        {
            return res.status(403).json({message:"You are not logged in"});
        }
        
        const is_default=await Address.findOne({where:{id:address,user_id:user}});

        if(!is_default) {
            return res.status(404).json({ message: "Address not found" });
        }
        
        await Address.destroy({where:{id:address,user_id:user}});

        const nextDefault=await Address.findOne({where:{user_id:user}});

        if(is_default.is_default)
        {
        await Address.update({where:{id:nextDefault.id}});
        }

        return res.status(200).json("Address delete succesful");
    } catch (error) {
        return res.status(500).json({message:"Server Error"});
    }
}
module.exports={addAddress};