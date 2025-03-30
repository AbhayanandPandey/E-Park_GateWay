const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const sendOTPEmail1 = require("./middleware/sendOTPEmail");
const sendCNFEmail1 = require("./middleware/sendCNFEmail");
const jwt = require("jsonwebtoken");
app.use(cookieParser());
const profileUpdateEmail = require("./middleware/profileUpdateEmail");
const profileData = require("./middleware/profile");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "kjrvgkrewgfuwgfvjkjewqwgfueqgf",
    resave: false,
    saveUninitialized: true,
    cookie: { 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
    },
  })
);
const OTP = {otp:null};
const moment = require("moment-timezone");
const E_M = { em: null };
const G_A = { ga: null, rn: null };
const { engine } = require("express-handlebars");
const { json } = require("express");
const { PORT } = require("./config/env");
require("./database/connection");
const path = require("path");
const register = require("./models/registers");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("views"));
app.set("view engine", "hbs");
function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    req.session.redirectTo = req.originalUrl; 
    return res.redirect("/loginsignup"); 
  }
  next(); 
}
app.get("/", (req, res) => {
  G_A.ga = null;
  G_A.rn = null;
  res.render("home");
});
app.get("/loginsignup", (req, res) => {
  const alertMessage = req.session.alertMessage;
  const alertType = req.session.alertType;
  req.session.alertMessage = null;
  req.session.alertType = null;
  res.render("loginsignup", { alertMessage, alertType });
});
app.get("/index",isAuthenticated, (req, res) => {
  
    const alertMessage = req.session.alertMessage;
    const alertType = req.session.alertType;
    req.session.alertMessage = null;
    req.session.alertType = null;
    res.render("index", { alertMessage, alertType });
});
app.get("/forgot", (req, res) => {
  const alertMessage = req.session.alertMessage;
  const alertType = req.session.alertType;
  req.session.alertMessage = null;
  req.session.alertType = null;
  res.render("forgot", { alertMessage, alertType });
});
app.get("/otp", (req, res) => {
  const alertMessage = req.session.alertMessage;
  const alertType = req.session.alertType;
  req.session.alertMessage = null;
  req.session.alertType = null;
  res.render("otp", { alertMessage, alertType });
});
app.get("/Resend-OTP", (req, res) => {
  const alertMessage = req.session.alertMessage;
  const alertType = req.session.alertType;
  req.session.alertMessage = null;
  req.session.alertType = null;
  res.render("otp", { alertMessage, alertType });
});
app.get("/confirm", (req, res) => {
  const email = req.session.email;
  const alertMessage = req.session.alertMessage;
  const alertType = req.session.alertType;
  req.session.alertMessage = null;
  req.session.alertType = null;
  res.render("confirm", { alertMessage, alertType, email });
});
app.get("/about",isAuthenticated, (req, res) => {
    res.render("about");
});
app.get("/privacy", isAuthenticated, (req, res) => {
  res.render("privacy");
});

app.get("/companygarden", isAuthenticated, (req, res) => {
  res.render("companygarden");
});

app.get("/services", isAuthenticated, (req, res) => {
  res.render("services");
});
app.get("/confirm", (req, res) => {
  const email = req.session.email; 
  if (!email) {
    return res.redirect("/forgot"); 
  }
  res.render("confirm", {
    alertMessage: req.session.alertMessage,
    alertType: req.session.alertType,
    email,
  });
});
app.get("/testimonials", isAuthenticated, (req, res) => {
  res.render("testimonials");
});

app.get("/pricing", isAuthenticated, (req, res) => {
  res.render("pricing");
});

app.get("/contact", isAuthenticated, (req, res) => {
  res.render("contact");
});

app.get("/portfolio", isAuthenticated, (req, res) => {
  res.render("portfolio");
});

app.get("/portfolio-details", isAuthenticated, (req, res) => {
  res.render("portfolio-details");
});

app.get("/blog", isAuthenticated, (req, res) => {
  res.render("blog");
});

app.get("/blog-details", isAuthenticated, (req, res) => {
  res.render("blog-details");
});

app.get("/hathipark", isAuthenticated, (req, res) => {
  res.render("hathipark");
});

app.get("/servise-details", isAuthenticated, (req, res) => {
  res.render("servise-details");
});
app.get("/profiledetails", profileData, (req, res) => {
  if (!req.session.userId) {
    req.session.redirectTo = req.originalUrl;
    return res.redirect("/loginsignup");
  }
  
  res.render("profiledetails", { 
    userN: req.session.userN,
    userE: req.session.userE,
    alertMessage: req.session.alertMessage,
    alertType: req.session.alertType
  });

  req.session.alertMessage = null;
  req.session.alertType = null;
});
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid");
    res.clearCookie("authToken");
    res.redirect("/");
  });
});
app.get("/home", (req, res) => {
  G_A.ga = null;
  G_A.rn = null;
  res.render("home");
});
app.get("/", (req, res) => {
  res.send("hello");
});
app.get("/forgot", (req, res) => {
  res.render("forgot");
});
app.get("/otp", (req, res) => {
  res.render("otp");
});

app.post("/register", async (req, res) => {
  try {
    const { User_name, email, password } = req.body;
    if (!User_name || !email || !password) {
      req.session.alertMessage = "Please fill all the fields.";
      req.session.alertType = "danger";
      return res.status(400).redirect("/loginsignup");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.session.alertMessage = "Please enter a valid email address.";
      req.session.alertType = "danger";
      return res.status(400).redirect("/loginsignup");
    }
    const existingUser = await register.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      req.session.alertMessage = "Email already exists.";
      req.session.alertType = "danger";
      return res.status(400).redirect("/loginsignup");
    }
    const newUser = new register({
      User_name,
      email: email.toLowerCase(),
      password: password,
    });
    const token = await newUser.generateAuthToken();
    await newUser.save();
    await sendCNFEmail1(email);
    req.session.alertMessage =
      "Registration successful. Please check your email for confirmation.";
    req.session.alertType = "success";
    res.status(201).redirect("/loginsignup");
  } catch (err) {
    console.error("Registration error: ", err);
    req.session.alertMessage =
      "An error occurred during registration. Please try again.";
    req.session.alertType = "danger";
    res.status(400).redirect("/loginsignup");
  }
});

app.post("/login", async (req, res) => {
  try {
    const log_n = req.body.log_name.toLowerCase();
    const log_p = req.body.log_password;
    const user = await register.findOne({ email: log_n });
    if (!user) {
      req.session.alertMessage = "User not exist";
      req.session.alertType = "danger";
      return res.status(400).redirect("/loginsignup");
    }
    const isMatch = await bcrypt.compare(log_p, user.password);

    if (!isMatch) {
      req.session.alertMessage = "Invalid email or password";
      req.session.alertType = "danger";
      return res.status(400).redirect("/loginsignup");
    }
    req.session.userId = user._id;
    const token = await user.generateAuthToken();
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    G_A.ga = 999;
    const indiaTime = moment().tz("Asia/Kolkata").format();
    user.lastLogin = indiaTime;
    const z1 = user.email;
    const z2 = user.User_name;
    await user.save();
    req.session.alertMessage = "Login successful!";
    req.session.alertType = "success";
    const redirectRoute = req.session.redirectTo || "/index"; 
req.session.redirectTo = null; 
res.status(200).redirect(redirectRoute);
  } catch (error) {
    console.error("Login error: ", error);
    req.session.alertMessage = "An error occurred. Please try again.";
    req.session.alertType = "danger";
    res.status(400).redirect("/loginsignup");
  }
});
app.post("/Resend-OTP", async (req, res) => {
  const now = Date.now();
  const lastSent = req.session.lastSent || 0;
  if (now - lastSent >= 30000) {
    await generateAndSendOTP(req);
    req.session.lastSent = Date.now();
    req.session.alertMessage = "OTP resent successfully.";
    req.session.alertType = "success";
    req.session.alertMessage = null;
    req.session.alertType = null;
    res.status(200).send("OTP resent successfully.");
  } else {
    const remainingTime = Math.floor((30000 - (now - lastSent)) / 1000);
    req.session.alertMessage = `Please wait ${remainingTime} seconds before resending OTP.`;
    req.session.alertType = "danger";
    req.session.alertMessage = null;
    req.session.alertType = null;
    res
      .status(429)
      .send(`Please wait ${remainingTime} seconds before resending OTP.`);
  }
});
async function generateAndSendOTP(req) {
  req.session.otp = Math.floor(1000 + Math.random() * 9000);
  req.session.email = req.body.data_email || req.session.email || E_M.em;
  req.session.lastSent = Date.now();
  try {
    console.log(req.session.email, req.session.otp);
    await sendOTPEmail1(req.session.email, req.session.otp);
    console.log("OTP sent:", req.session.otp);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP.");
  }
}
app.post("/forgot", async (req, res) => {
  try {
    const email = req.body.for_name.toLowerCase();
    E_M.em = email;
    req.session.otp = Math.floor(1000 + Math.random() * 9000);
    req.session.lastSent = Date.now();
    const user = await register.findOne({ email: email });
    if (email === "") {
      req.session.alertMessage = "Plese enter a email";
      req.session.alertType = "danger";
      return res.redirect("/forgot");
    }
    if (!user) {
      req.session.alertMessage = "Invalid email. User not found.";
      req.session.alertType = "danger";
      return res.redirect("/forgot");
    }
    try {
      await sendOTPEmail1(email, req.session.otp);
      console.log("OTP sent:", req.session.otp);
      req.session.alertMessage = "OTP Sent";
      req.session.alertType = "success";
      res.redirect("/otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).send("Failed to send OTP.");
    }
  } catch (error) {
    req.session.alertMessage = "An error occurred. Please try again.";
    req.session.alertType = "danger";
    return res.status(400).redirect("/forgot");
  }
});
app.post("/otp", (req, res) => {
  const userOTP = req.body.conotp;
  console.log("User-entered OTP:", userOTP);
  if (userOTP === req.session.otp?.toString()) {
    req.session.destroy();
    res.status(200).redirect("/confirm");
  } else {
    req.session.alertMessage = "An error occurred. Please try again.";
    req.session.alertType = "danger";
    res.status(400).redirect("/otp");
  }
});
app.post("/confirm", async (req, res) => {
  const pas_2 = req.body.pas_2;
  const pas_1 = req.body.pas_1;
  const email = E_M.em;
  if (pas_1 !== pas_2) {
    req.session.alertMessage = "Passwords do not match.";
    req.session.alertType = "danger";
    return res.redirect("/confirm");
  }
  if (pas_1 === "" || pas_2 === "") {
    req.session.alertMessage = "Plese enter password.";
    req.session.alertType = "danger";
    return res.redirect("/confirm");
  }
  try {
    const user = await register.findOne({ email: email });
    if (!user) {
      req.session.alertMessage = "Invalid email. User not found.";
      req.session.alertType = "danger";
      return res.redirect("/loginsignup");
    }
    user.password = pas_1;
    await user.save();
    req.session.alertMessage = "Password updated successfully!";
    req.session.alertType = "success";
    return res.redirect("/loginsignup");
  } catch (error) {
    req.session.alertMessage = "An error occurred. Please try again.";
    req.session.alertType = "danger";
    return res.status(400).redirect("/loginsignup");
  }
});
app.post("/update-profile", async (req, res) => {
    try {
        const { newEmail, newUsername, currentPassword, ueml } = req.body;
        console.log("Received email:", ueml);

        const user1 = await register.findOne({ email: ueml });
        if(!currentPassword)
        {
          return res.json({ message: "Plese Enter Password!", redirect: "/profiledetails" });
        }
        if (!user1) {
            req.session.alertMessage = "User not found or not authenticated.";
            req.session.alertType = "danger";
            return res.redirect("/index");
        }

        const user = await register.findById(user1._id);
        if (!user) {
            req.session.alertMessage = "User not found.";
            req.session.alertType = "danger";
            return res.status(404).redirect("/loginsignup");
        }

        if (newEmail && newEmail !== user.email) {
            const existingUser = await register.findOne({ email: newEmail.toLowerCase() });
            if (existingUser) {
                req.session.alertMessage = "Email already in use.";
                req.session.alertType = "danger";
                return res.status(400).redirect("/index");
            }
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            req.session.alertMessage = "Incorrect password.";
            req.session.alertType = "danger";
            return res.status(400).redirect("/index");
        }

        if (newUsername) user.User_name = newUsername;
        if (newEmail) user.email = newEmail.toLowerCase();
        await user.save();

        req.session.userN = user.User_name;
        req.session.userE = user.email;
        req.session.alertMessage = "Profile updated successfully!";
        req.session.alertType = "success";

        return res.redirect("/index");
    } catch (error) {
        console.error("Profile update error:", error);
        req.session.alertMessage = "An error occurred.";
        req.session.alertType = "danger";
        return res.status(500).redirect("/index");
    }
});
app.post("/Edit-profile-details", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send("Email is required.");
  }
  console.log("Received email:", email);
  try {
    alertMessage = `OTP send to your email: ${email}`;
    alertType="success"
    OTP.otp = Math.floor(100000 + Math.random() * 900000);
    await profileUpdateEmail(email,OTP.otp); 
    res.send(`Server received email: ${email}`);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Internal server error.");
  }
});
app.post("/conf-OTP", async (req, res) => {
  try {
    const { otp, email, cemail, name } = req.body;
    
    if (!otp) {
      return res.status(400).json({ message: "OTP is required." });
    }
    console.log(OTP.otp)
    console.log(otp,email, cemail, name )

    const user = await register.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (OTP.otp.toString().trim() !== otp.toString().trim()) {
      return res.status(401).json({ message: "Invalid OTP. Profile Not Updated" });
    }
    if (name) user.User_name = name;
    if (cemail) user.email = cemail.toLowerCase();
    await user.save();
    return res.json({ message: "Profile Updated successfully!", redirect: "/profiledetails" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

app.use((req, res) => {
  res.status(404).render("NotFount");
});
app.listen(PORT, (req, res) => {
  console.log(`server is running in port no ${PORT}`);
});
  