//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.SECRET);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB"); // MongoDB mize bağlanabilmek için mongoose kullanıyoruz.

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);



//  //Connecting to the database using mongoose.
// main().catch(err => console.log(err));
// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
// }

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", async (req, res) => {
    try {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        const result = await newUser.save();
        if (result) {
            res.render("secrets");
        } else {
            console.log("Login Failed");
        }

    } catch (error) {
        console.log(error);
    }
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {

        const foundUser = await User.findOne({
            email: username
        })
        if (foundUser) {
            if (foundUser.password === password) {
                console.log("Connecting to the secrets...")
                res.render("secrets");
            } else {
                console.log("Password doesn't match")
            }
        }else {
            console.log("User not found...")
        }
    } catch (err) {
        console.log(err);
    }
});



app.listen(3000, function () {
    console.log("Server started on port 3000.!!!");
})