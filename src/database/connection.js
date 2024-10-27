const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/CPDatabase")
.then(()=>
{
    console.log("connection successful")
})
.catch((err)=>
{
    console.log(err)
})

// const sh = 