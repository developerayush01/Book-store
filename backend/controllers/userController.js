const supabase = require("../config/supabase");
const { User } = require("../models");
const multer = require("multer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/sendEmail");

const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

    if (!userId) {
      return res.status(403).json({ message: "Login First" });
    }

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      await supabase.storage
        .from("user-profiles")
        .remove([`${userId}/profile.jpg`]);
      ("Old file deleted");
    } catch (deleteError) {
      ("Old file delete error (ok if not exists):", deleteError);
    }

    const { data, error } = await supabase.storage
      .from("user-profiles")
      .upload(`${userId}/profile.jpg`, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      return res.status(400).json({ message: "Upload Failed" });
    }

    const { data: urlData } = supabase.storage
      .from("user-profiles")
      .getPublicUrl(`${userId}/profile.jpg?t=${Date.now()}`);

    const imageUrl = urlData.publicUrl + `?t=${Date.now()}`;
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ profilePicture: imageUrl });

    return res.status(200).json({
      message: "Profile picture Updated successfully",
      profilePictureUrl: imageUrl,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error on profile picture upload" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already existed" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      is_verified: false,
      verification_token: otp,
      verification_token_expiry: expiry,
    })("User created, sending email to:", email);
    await sendVerificationEmail(email, otp);
    ("Email sent successfully");
    return res
      .status(201)
      .json({ message: "Registered successfully. Check your email for OTP." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    } else {
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      if (!existingUser.is_verified) {
        return res
          .status(403)
          .json({ message: "Email not verified", email: existingUser.email });
      }

      if (isMatch) {
        const token = jwt.sign(
          { userId: existingUser.id, phone: existingUser.phone },
          process.env.JWT_SECRET,
          { expiresIn: "30d" },
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: true, 
  sameSite: 'none',
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ message: "Log in succesful" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (user.verification_token !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > new Date(user.verification_token_expiry)) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    await user.update({
      is_verified: true,
      verification_token: null,
      verification_token_expiry: null,
    });

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.is_verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.update({
      verification_token: otp,
      verification_token_expiry: expiry,
    });
    await sendVerificationEmail(email, otp);

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "verification_token"],
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, phone } = req.body;
    const user = await User.findOne({ where: { id: userId } });
    if (!userId) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.update({ name, email, phone });
    return res.status(200).json({ message: "User updated succesfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error on user update" });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ where: { id: userId } });
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(400).json({ message: "Wrong password" });
    }

    if (oldPassword == newPassword) {
      return res.status(400).json({ message: "Same Password Cannot be used" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New Password and confirm password did not matched" });
    }
    await user.update({ password: bcrypt.hashSync(newPassword, 10) });
    return res.status(200).json({ message: "Password changed succesfully" });
  } catch (error) {
    ("Error:", error);
    return res.status(400).json({ message: "Server error on password change" });
  }
};

const logOut = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error on logout" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  uploadProfilePicture,
  editProfile,
  changePassword,
  getProfile,
  logOut,
};
