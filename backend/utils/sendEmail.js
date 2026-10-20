const Brevo = require("@getbrevo/brevo");

const sendVerificationEmail = async (email, otp) => {
  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    
    // Set the API key using the correct method for the SDK
    apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey, 
      process.env.BREVO_API_KEY
    );

    const response = await apiInstance.sendTransacEmail({
      sender: { name: "Books Deal", email: process.env.EMAIL_USER },
      to: [{ email }],
      subject: "Verify your email",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px;">
          <h2 style="color: #1e293b;">Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 8px; color: #1e293b; font-size: 36px;">${otp}</h1>
          <p style="color: #64748b;">This code expires in 10 minutes.</p>
        </div>
      `,
    });
    
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email via Brevo:", error.response?.text || error.message);
    throw error;
  }
};

module.exports = { sendVerificationEmail };