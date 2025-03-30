const mongoose = require("mongoose");
const { DB_URL } = require("../config/env");
mongoose.connect(DB_URL)
.then(()=>{console.log("connection successful")})
.catch((err)=>{console.log(err)})