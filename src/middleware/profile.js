const express = require("express");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');
const register = require('../models/registers');
const app = express();
app.use(cookieParser())
const profileData = async (req,res)=>
{
  try {
    const tkn = req.cookies.authToken;
    if (!tkn) {
      return res.status(401).redirect("/loginsignup");
    }
    const decoded = jwt.verify(tkn, "token");
    const user = await register.findById(decoded._id);
    if (!user) {
      return res.status(404).redirect("/loginsignup");
    }
    req.user = user;
    const userN = user.User_name;
    const userE = user.email;
    res.render("profiledetails", { userN, userE });
  } catch (err) {
    console.error(err.message); // Log the error for debugging
    return res.status(500).render("Error", { message: "Something went wrong" });
  }
}

  module.exports = profileData;