const User=require("../models/userModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const registerUser = async(req,res)=>{

    try {
        const{name,email,phone,password}=req.body;

        const existingUser= await User.findOne({where:{phone}});
        if(existingUser)
        {
            return res.status(400).json({message:"Phone number  already registered"});
        }

        const hashPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            name,
            email,
            phone,
            password:hashPassword,
        })

        res.status(201).json({message:"User registered succesfully"});

    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message})
    }

}

modules.exports= {registerUser};