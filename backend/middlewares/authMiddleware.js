const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware=(req,res,next)=>{

    const token=req.cookies.token;

    if(!token)
    {
        return res.status(401).json({message:"Invalid token"});
    }

    const decode=jwt.verify(token,process.env.JWT_SECRET);

}