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

        const existingEmail= await User.findOne({where:{email}});
        if(existingEmail)
        {
            return res.status(400).json({message:"Email already existed"});
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

const loginUser=async(req,res)=>{

    try {
        
        const {phone,password}=req.body;
    
        const existingUser=await User.findOne({where:{phone}});
        
        if(!existingUser)
            {
                return res.status(400).json({message:"User not found"})
            }
            else
                {
            const isMatch = await bcrypt.compare(password, existingUser.password);

            if(!isMatch)
            {
            return res.status(401).json({message:"Invalid password"});
            }
            if(isMatch)
            {
                const token=jwt.sign(
                    {userId:existingUser.id,phone:existingUser.phone},
                process.env.JWT_SECRET,
            {expiresIn:"30d"}
        )

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:30*24*60*60*1000
        })
                return res.status(200).json({message:"Log in succesful"});
            }
            
        }
    } catch (error) {
        return res.status(500).json({message:"Server error"});
    }

}

const getProfile=async(req,res)=>{
    try {
        const userId=req.user.userId;
        const user=await User.findOne({
            where:{id:userId},
            attributes:{exclude:["password","createdAt","updatedAt"]}
        });

        if(!user)
        {
            return res.status(401).json({message:"User not found"});
        }
            return res.status(200).json({user});
    }

    catch (error) {
        return res.status(500).json({message:"Server error"});
    }
}
    
const logOut=async(req,res)=>{
    try {
    const userId=req.user.userId;
    if(!userId)
    {
        return res.status(401).json({message:"You are not logged in"});
    }

    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
    
} catch (error) {
    return res.status(500).json({message:"Server error on logout"});
}
}
module.exports= {registerUser,loginUser,getProfile,logOut};