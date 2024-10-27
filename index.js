const express = require("express");
const { engine } = require('express-handlebars')
const { json } = require('express')
const app = express();
const port = process.env.PORT || 3000;
require("./database/connection")
const path = require("path")
const register = require("./models/registers");

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
//set static path
app.use(express.static('views'));
app.set("view engine", "hbs")
//default path
app.get("/", (req, res) => {
    res.render("home")

})
//login path
app.get("/loginsignup", (req, res) => {
    res.render("loginsignup");
})
app.get("/index", (req, res) => {
    res.render("index")

})
app.get("/about", (req, res) => {
    res.render("about")

})
app.get("/services", (req, res) => {
    res.render("services")

})
app.get("/testimonials", (req, res) => {
    res.render("testimonials")

})
app.get("/pricing", (req, res) => {
    res.render("pricing")

})
app.get("/contact", (req, res) => {
    res.render("contact")

})
app.get("/portfolio", (req, res) => {
    res.render("portfolio")

})
app.get("/portfolio-details", (req, res) => {
    res.render("portfolio-details")

})
app.get("/blog", (req, res) => {
    res.render("blog")

})
app.get("/blog-details", (req, res) => {
    res.render("blog-details")

})
app.get("/hatipark", (req, res) => {
    res.render("hatipark")

})
app.get("/servise-details", (req, res) => {
    res.render("servise-details")

})
app.get("/home", (req, res) => {
    res.render("home");
})
app.get("/", (req, res) => {
    res.send("hello");
})
//forgot password path
app.get("/forgot", (req, res) => {
    res.render("forgot");
})

//register
app.post("/register", async (req, res) => {
    try {
        const registerData = new register
            ({
                User_name: req.body.User_name,
                email: req.body.email,
                password: req.body.password
            })
        const registered = await registerData.save();
        res.status(201).render("index")
    } catch (err) {
        res.status(400).send(err);
    }
})
//login 
app.post("/login", async (req, res) => {
    try {
        const log_n = req.body.log_name;
        const log_p = req.body.log_password;
        const user = await register.findOne({ email: log_n, password: log_p })
        if (!user) {
            return res.status(400).send("Invalid Credentials");
        }
        else {
            res.status(200).render("index")
        }

    } catch (error) {
        res.status(400).send("Invalid Email");
    }
})
//forgot
app.post("/forgot", async (req, res) => {
    try {
        const log_fn = req.body.for_name;
        const log_fp = req.body.for_password;
        const log_cfp = req.body.for_c_password;
        const user = await register.findOne({ email: log_fn, password: log_fp })
        if (!user) {
            return res.status(400).send("Invalid Credentials");
        }
        else {
            const id = user._id;
            try {
                const user = await register.findByIdAndUpdate(id, { password: log_cfp }, { new: true })
                res.send("Password Updated")
                res.render("index")
            } catch (error) {
                res.status(400).send("Invalid Email");
            }
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

// local host
app.listen(port, (req, res) => {
    console.log(`server is running in port no ${port}`);
})