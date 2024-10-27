const path = require("path")
console.log(path.join(__dirname))
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("./database/connection")


app.use(express.static());
app.get("/",(req,res)=>
{
    res.send("hello");
})
app.listen(port,(req,res)=>
{
    console.log(`server is running in port no ${port}`);
})