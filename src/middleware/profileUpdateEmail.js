const nodemailer = require("nodemailer");
const register = require("../models/registers");

async function profileUpdateEmail(email,otp) {
  try {
    const user = await register.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return "User not found";
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,        // ✅ IMPORTANT
      secure: false,
      auth: {
        user: "eparkgateway@gmail.com", 
        pass: "mzjitfzzrrwlgmum", 
      },
    });
    const mailOptions = {
      from: "E-Park-Gateway",
      to: email,
      subject: "One Time Password For Update Profile",
      html: `
        <div style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #007BFF; font-size: 28px; margin: 0;">Your One Time Password (OTP)</h1>
          </div>

          <div style="font-size: 16px; line-height: 1.6; color: #333333;">
            <p style="margin: 0; padding: 10px 0;">Hi ${user.User_name},</p>

            <p style="margin: 0; padding: 10px 0;">Your One Time Password (OTP) is:</p>
            <p style="font-size: 24px; font-weight: bold; color: #007BFF; margin-top: 20px;">${otp}</p>

            <p style="margin: 0; padding: 10px 0;">This OTP is valid for a limited time. Please use it to complete your authentication process.</p>

            <p style="margin: 0; padding: 10px 0;">If you did not request this OTP, please disregard this email.</p>
            
            <p style="margin: 0; padding: 10px 0;">Thank you for using E-Park Gateway!</p>
            <p style="margin: 0; padding: 10px 0;">Best regards,<br />The E-Park Gateway Team</p>
          </div>

          <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #888888;">
            <p style="margin: 0;">If you did not request this OTP, please ignore this email.</p>
            <p style="margin: 0;"><a href="https://www.e-park-gateway.com/unsubscribe" style="color: #007BFF; text-decoration: none;">Unsubscribe</a> from our emails.</p>
          </div>
        </div>`,
    };
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully to:");
    console.log(otp);
    return "OTP sent successfully";
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email.");
  }
}
module.exports = profileUpdateEmail;
