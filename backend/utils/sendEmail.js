const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, otp) => {
  try {
    const data = await resend.emails.send({
      from: 'Books Deal <onboarding@resend.dev>', // Resend provides a default tested sender domain for development
      to: [email],
      subject: 'Verify your email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px;">
          <h2 style="color: #1e293b;">Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 8px; color: #1e293b; font-size: 36px;">${otp}</h1>
          <p style="color: #64748b;">This code expires in 10 minutes.</p>
        </div>
      `,
    });

    console.log("Email sent successfully via Resend:", data);
  } catch (error) {
    console.error("Error sending email via Resend:", error.message);
    throw error;
  }
};

module.exports = { sendVerificationEmail };