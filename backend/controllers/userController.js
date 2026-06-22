const supabase = require("../config/supabase");
const {User}=require("../models");
const multer=require('multer');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");


const uploadProfilePicture=async(req,res)=>{
    try {
        const userId=req.user.userId;
        const file=req.file;

        if(!userId){
            return res.status(403).json({message:"Login First"});
        }

         if(!file) {
            return res.status(400).json({message:"No file uploaded"});
        }

        try {
            await supabase
                .storage
                .from('user-profiles')
                .remove([`${userId}/profile.jpg`]);
            console.log("Old file deleted");
        } catch(deleteError) {
            console.log("Old file delete error (ok if not exists):", deleteError);
        }
        
        const {data,error}=await
        supabase
        .storage.from('user-profiles')
        .upload(`${userId}/profile.jpg`,file.buffer,{contentType:file.mimetype,upsert:true});

        if(error){
  return res.status(400).json({message: "Upload Failed"});  
}

const { data: urlData } = supabase
    .storage
    .from('user-profiles')
    .getPublicUrl(`${userId}/profile.jpg?t=${Date.now()}`);

        const imageUrl = urlData.publicUrl + `?t=${Date.now()}`;
        const user=await User.findOne({where:{id:userId}});

         if(!user) {
            return res.status(404).json({message:"User not found"});
        }

        await user.update({profilePicture:imageUrl});

        return res.status(200).json({
            message: "Profile picture Updated successfully",
            profilePictureUrl: imageUrl
        });

    } catch (error) {
        return res.status(500).json({message:"Server error on profile picture upload"});
    }
}

const registerUser = async(req,res)=>{

    try {
        const{name,email,password}=req.body;

        const existingEmail= await User.findOne({where:{email}});
        if(existingEmail)
        {
            return res.status(400).json({message:"Email already existed"});
        }

        const hashPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            name,
            email,
            password:hashPassword,
        })

      return res.status(201).json({message:"User registered succesfully"});

    } catch (error) {
        res.status(500).json({message:"Server error",error:error.message})
    }
}

const loginUser=async(req,res)=>{

    try {
        
        const {email,password}=req.body;
    
        const existingUser=await User.findOne({where:{email}});
        
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
    

const editProfile=async(req,res)=>{
    try {
        const userId=req.user.userId;
        const { name, email, phone } = req.body;
        const user = await User.findOne({ where: { id: userId } });
    if(!userId)
    {
        return res.status(401).json({message:"You are not logged in"});
    }

    if(!user) {
            return res.status(404).json({message:"User not found"});
        } 
    await user.update({ name, email, phone });
    return res.status(200).json({message:"User updated succesfully"});
    } catch (error) {
        return res.status(500).json({message:"Server error on user update"});
    }
}

    const changePassword = async(req, res) => {
        try {
            const userId=req.user.userId;
            const user = await User.findOne({ where: { id: userId } });
             const { oldPassword, newPassword,confirmPassword } = req.body;

    if(!bcrypt.compareSync(oldPassword, user.password)) {
        return res.status(400).json({message:"Wrong password"});
    }

    if(oldPassword==newPassword){
        return res.status(400).json({message:"Same Password Cannot be used"});
    }

    if(newPassword!==confirmPassword){
        return res.status(400).json({message:"New Password and confirm password did not matched"});
    }
    await user.update({ password: bcrypt.hashSync(newPassword, 10)});
    return res.status(200).json({message:"Password changed succesfully"});
        } catch (error) {
            console.log("Error:", error);
            return res.status(400).json({message:"Server error on password change"});
        }
   
};

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
module.exports= {registerUser,loginUser,uploadProfilePicture,editProfile,changePassword,getProfile,logOut};