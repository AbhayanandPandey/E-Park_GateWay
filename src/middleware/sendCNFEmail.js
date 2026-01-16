const nodemailer = require("nodemailer");
const register = require("../models/registers");
function sendCNFEmail1(email)
{
    const sendCNFEmail = async (req, res) => {
        try {
          const user = await register.findOne({ email: email });
      
          if (!user) {
            return res.status(404).json({ message: "User not found." });
          }
      
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "eparkgateway@gmail.com",
              pass: "mzjitfzzrrwlgmum",
            },
          });
      
          const mailOptions = {
            from: "E-Park-Gateway",
            to: email,
            subject: `Registration Successful`,
            html: `
              <div style="width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #007BFF; font-size: 28px; margin: 0;">Welcome to E-Park Gateway, ${user.User_name}!</h1>
                </div>
      
                <div style="font-size: 16px; line-height: 1.6; color: #333333;">
                  <p>Hi ${user.User_name},</p>
                  <p>Thank you for registering with <strong>E-Park Gateway</strong>. We're thrilled to have you on board. You can now enjoy our seamless parking solutions and start using our services immediately.</p>
                  <p>If you have any questions or need assistance, feel free to visit our <a href="https://www.e-park-gateway.com/support" target="_blank" style="color: #007BFF; text-decoration: none;">Support Center</a> or contact our customer service team.</p>
                  <p>To get started, click the button below to log in to your account and explore all the features:</p>
      
                  <div style="display: flex; justify-content: center; margin-top: 20px;">
                    <a href="https://www.e-park-gateway.com/login" style="padding: 12px 24px; background-color: #007BFF; color: #ffffff; text-align: center; text-decoration: none; border-radius: 4px; font-weight: bold;">Go to Dashboard</a>
                  </div>
      
                  <p>Thank you for choosing E-Park Gateway!</p>
                  <p>Best regards,<br />The E-Park Gateway Team</p>
                </div>
      
                <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #888888;">
                  <p>If you did not register for this account, please ignore this email.</p>
                  <p><a href="https://www.e-park-gateway.com/unsubscribe" style="color: #007BFF; text-decoration: none;">Unsubscribe</a> from our emails.</p>
                </div>
              </div>
            `,
          };
      
          await transporter.sendMail(mailOptions);
          console.log("Email sent successfully");
        } catch (error) {
          console.error("Error sending email:", error);
          res.status(500).json({ message: "Failed to send confirmation email.", error });
        }
      };
    sendCNFEmail();
}

module.exports = sendCNFEmail1;
