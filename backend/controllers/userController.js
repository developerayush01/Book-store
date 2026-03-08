const User=("../models/userModel");
const bcypt=require("bcrypt");

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
            id: uuidv4(),
            name,
            email,
            phone,
            password:hashedPassword,
        })

    } catch (error) {
        
    }

}