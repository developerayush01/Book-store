const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Book Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px;">
        <h2 style="color: #1e293b;">Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 8px; color: #1e293b; font-size: 36px;">${otp}</h1>
        <p style="color: #64748b;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail };