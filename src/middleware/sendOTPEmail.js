const nodemailer = require("nodemailer");
const register = require("../models/registers");

function sendOTPEmail1(email, otp) {
  const sendOTPEmail = async (req, res) => {
    try {

      const user = await register.findOne({ email: email });
      if (!email || !otp) {
        console.log("not email")
      }
      if (!user) {
        console.log("not user")
      }
      const transporter = await nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,     
        secure: false,
        auth: {
          user: "eparkgateway@gmail.com",
          pass: "mzjitfzzrrwlgmum",
        },
      });

      const mailOptions = {
        from: "E-Park-Gateway",
        to: email,
        subject: "One Time Password",
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

      transporter.sendMail(mailOptions);
      // next(); // Pass control to the next middleware/route handler
    } catch (error) {
      console.error("Error sending OTP email:", error);
      if (res && res.status) {
        res.status(500).json({ message: "Failed to send OTP email.", error: error.message });
      } else {
        console.error("Response object not available to handle error:", error.message);
        // next(error); // Pass error to the global error handler
      }
    }
  };
  sendOTPEmail()
}

module.exports = sendOTPEmail1;
