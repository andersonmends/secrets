//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true});

let userSchema = new mongoose.Schema({
    login: String,
    password: String
});




var encKey = process.env.SOME_32BYTE_BASE64_STRING;
var sigKey = process.env.SOME_64BYTE_BASE64_STRING;

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/login", function (req, res) {
    res.render("login");
});


app.post("/register", function (req, res) {

    const userRegister = new User({
        login: req.body.username,
        password: req.body.password
    });

    userRegister.save(function (err) {
        if (!err) {
            res.render("secrets");
        } 
    });
});

app.post("/login", function (req, res) {
    console.log(req.body.username);
    
    User.findOne({ email: req.body.username }, function (err, findUser) {
        console.log(findUser);
        if (err) {
            res.send("Login failed");
        } else {
            if (findUser.password === req.body.password) {
                res.render("secrets");
            } else {
                res.send("Login failed");
            }
        }
    });
});


app.listen(3000, function () {
  console.log("Server has started successfully");
});
