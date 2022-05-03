require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./User");


mongoose.connect(
	`mongodb+srv://admin-AidenZhao:${process.env.PASS}@cluster0.j6gax.mongodb.net/UserDB`,
	function () {
		console.log("Successfully connected to database");
	}
);

app = new express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
	res.render("home");
});

app.get("/register", function (req, res) {
	res.render("register");
});

app.get("/login", function (req, res) {
	res.render("login", {
		username: "",
		password: "",
		errMsg: "",
	});
});

app.post("/register", function (req, res) {

    

});

app.post("/login", function (req, res) {
	
});

app.listen(3000 || process.env.PORT, function () {
	console.log("Server started successfully");
});
