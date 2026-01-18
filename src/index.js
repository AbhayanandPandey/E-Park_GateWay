const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const sendOTPEmail1 = require("./middleware/sendOTPEmail");
const sendCNFEmail1 = require("./middleware/sendCNFEmail");
const generateRandomProductId = () => {
  return 'E-PARK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};
const isAuth = require("./middleware/isAuthentic");
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const jwt = require("jsonwebtoken");
app.use(cookieParser());
const profileUpdateEmail = require("./middleware/profileUpdateEmail");
const profileData = require("./middleware/profile");

app.set("trust proxy", 1); // IMPORTANT FOR RENDER
app.use(
  session({
    secret: "kjrvgkrewgfuwgfvjkjewqwgfueqgf",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);
const OTP = { otp: null };
const email = { email: null };
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

function sessionMessageHandler(req, res, next) {
  res.locals.alertMessage = req.session.alertMessage || null;
  res.locals.alertType = req.session.alertType || null;
  req.session.alertMessage = null;
  req.session.alertType = null;
  next();
}

app.get("/", (req, res) => {
  G_A.ga = null;
  G_A.rn = null;
  res.render("home");
});
app.get("/loginsignup", sessionMessageHandler, (req, res) => {
  res.render("loginsignup");
});
app.get("/index", isAuthenticated, sessionMessageHandler, (req, res) => {
  res.render("index");
});
app.get("/forgot", sessionMessageHandler, (req, res) => {
  res.render("forgot");
});
app.get("/otp", sessionMessageHandler, (req, res) => {
  res.render("otp");
});
app.get("/Resend-OTP", sessionMessageHandler, (req, res) => {
  res.render("otp");
});
app.get("/admin",(req, res) => {
  res.render("adminPanel");
});
app.get("/confirm", sessionMessageHandler, (req, res) => {
  const email = req.session.email;
  res.render("confirm", { email });
});
app.get("/about", isAuthenticated, (req, res) => {
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

const productData = {
  product_ID: null,
  productName: "Ticket for park",
  productPrice: "30.00",
  productDate: moment().tz("Asia/Kolkata").format("DD MMM YYYY, h:mm A"),
}
app.get("/pricing", isAuthenticated, (req, res) => {
  const randomProductId = generateRandomProductId();
  productData.product_ID = randomProductId;
  res.render("pricing", {
    product_ID: null,
    productName: null,
    productPrice: null,
    productDate: null,
    product_ID: productData.product_ID,
    productName: productData.productName,
    productPrice: productData.productPrice,
    productDate: productData.productDate,
  });
});

app.get("/contact", isAuthenticated, (req, res) => {
  res.render("contact");
});

app.get("/portfolio", isAuthenticated, (req, res) => {
  res.render("portfolio");
});
app.get("/support", isAuthenticated, (req, res) => {
  res.render("support");
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
app.get("/profiledetails", profileData, isAuthenticated, (req, res) => {
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
      return res.redirect("/loginsignup");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      req.session.alertMessage = "Please enter a valid email address.";
      req.session.alertType = "danger";
      return res.redirect("/loginsignup");
    }

    const existingUser = await register.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      req.session.alertMessage = "Email already exists.";
      req.session.alertType = "danger";
      return res.redirect("/loginsignup");
    }

    const newUser = new register({
      User_name,
      email: email.toLowerCase(),
      password,
    });

    await newUser.save(); // 🔥 token generate optional
    await sendCNFEmail1(email);

    req.session.alertMessage =
      "Registration successful. Please check your email for confirmation.";
    req.session.alertType = "success";

    return res.redirect("/loginsignup");
  } catch (err) {
    console.error("Registration error:", err);
    req.session.alertMessage =
      "An error occurred during registration. Please try again.";
    req.session.alertType = "danger";
    return res.redirect("/loginsignup");
  }
});


app.post("/login", async (req, res) => {
  try {
    const log_n = req.body.log_name?.toLowerCase();
    const log_p = req.body.log_password;

    if (!log_n || !log_p) {
      req.session.alertMessage = "Please enter email and password.";
      req.session.alertType = "danger";
      return res.redirect("/loginsignup");
    }

    email.email = log_n;

    const user = await register.findOne({ email: log_n });
    if (!user) {
      req.session.alertMessage = "User does not exist.";
      req.session.alertType = "danger";
      return res.redirect("/loginsignup");
    }

    const isMatch = await bcrypt.compare(log_p, user.password);
    if (!isMatch) {
      req.session.alertMessage = "Invalid email or password.";
      req.session.alertType = "danger";
      return res.redirect("/loginsignup");
    }

    req.session.userId = user._id;

    const token = await user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    user.lastLogin = moment().tz("Asia/Kolkata").format();
    await user.save();

    req.session.alertMessage = "Login successful!";
    req.session.alertType = "success";

    const redirectRoute = req.session.redirectTo || "/index";
    req.session.redirectTo = null;

    return res.redirect(redirectRoute);
  } catch (error) {
    console.error("Login error:", error);
    req.session.alertMessage = "An error occurred. Please try again.";
    req.session.alertType = "danger";
    return res.redirect("/loginsignup");
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
    if (!currentPassword) {
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
    alertType = "success"
    OTP.otp = Math.floor(100000 + Math.random() * 900000);
    await profileUpdateEmail(email, OTP.otp);
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
    console.log(otp, email, cemail, name)

    const user = await register.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (OTP.otp.toString().trim() !== otp.toString().trim()) {
      return res.status(401).json({ message: "Invalid OTP. Profile Not Updated" });
    }
    const existingUser = await register.findOne({ email: cemail.toLowerCase() });
    if (existingUser) {
      return res.json({ message: "User Already Exist!", redirect: "/index" });
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

app.post("/product", isAuthenticated, async (req, res) => {
  const user = await register.findOne({ email: email.email });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  try {
    const randomProductId = productData.product_ID
    const productdadada =
    {
      productDate: moment().tz("Asia/Kolkata").format("DD MMM YYYY, h:mm A"),
    }
    const date = new Date(productdadada.productDate);
    const dateOnly = date.toLocaleDateString();
    const timeOnly = date.toLocaleTimeString();
    const fulltime = `${dateOnly}, ${timeOnly}`;
    console.log("Date: ", dateOnly);
    const newProduct = {
      productID: randomProductId,
      productName: "Ticket for park",
      productPrice: "30.00",
      productImage: null,
      productDate: fulltime,
    };
    user.products.push(newProduct);
    await user.save();
    res.status(200).json({ message: "Ticket Booked successfully!", productId: randomProductId });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

app.get("/order_details", isAuthenticated, isAuth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log("Authenticated user email:", userEmail);

    const user = await register.findOne({ email: userEmail }).lean();
    console.log("Fetched user:", user);

    if (!user || !user.products || user.products.length === 0) {
      console.log("No products found");
      return res.render("orderdetails", { products: [] });
    }

    const recentProducts = user.products;
    console.log("Recent products:", recentProducts);

    res.render("orderdetails", { products: recentProducts });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).send("Server Error");
  }
});

app.post('/download_pdf',isAuthenticated, async (req, res) => {
  const { productID, productDate, productPrice } = req.body;

  const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f9f9f9;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .card {
          background: white;
          border: 2px solid #c6e1cc;
          border-radius: 12px;
          padding: 30px 40px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          text-align: center;
          width: 400px;
        }
        .checkmark {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #d4edda;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .checkmark::before {
          content: '✔';
          font-size: 32px;
          color: #155724;
        }
        h1 {
          color: #155724;
          margin-bottom: 10px;
        }
        .line {
          height: 1px;
          background-color: #c6e1cc;
          margin: 20px 0;
        }
        .row {
          display: flex;
          justify-content: space-between;
          margin: 6px 0;
          font-size: 16px;
        }
        .bold {
          font-weight: bold;
        }
        .button {
          margin-top: 20px;
          background-color: #2f7655;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="checkmark"></div>
        <h1>Payment Successful</h1>
        <div class="line"></div>
        <div class="row"><span class="bold">Receipt Number:</span> <span>#${productID}</span></div>
        <div class="row"><span class="bold">Booking Date:</span> <span>${productDate}</span></div>
        <div class="row"><span class="bold">Amount Paid:</span> <span>₹${productPrice}</span></div>
        <div class="row"><span class="bold">Payment Method:</span> <span>Credit Card</span></div>
        <button class="button">View Details</button>
      </div>
    </body>
  </html>
`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="receipt-${productID}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.end(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate PDF');
  }
});

const User = require('./models/registers');

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const token = jwt.sign({ username }, 'adminSecretKey', { expiresIn: '2h' });
    return res.send({ token });
  }
  res.status(401).send({ error: 'Invalid credentials' });
});

const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, 'adminSecretKey');
    if (decoded.username !== 'admin') throw new Error();
    next();
  } catch {
    res.status(403).send({ error: 'Unauthorized' });
  }
};
app.get('/admin/users', authenticateAdmin, async (req, res) => {
  const users = await User.find({}, 'User_name email');
  res.send(users);
});
app.post('/admin/userDetails', authenticateAdmin, async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send({ error: 'User not found' });
  res.send(user);
});


app.use((req, res) => {
  res.status(404).render("NotFount");
});
app.listen(PORT, (req, res) => {
  console.log(`server is running in port no ${PORT}`);
});
