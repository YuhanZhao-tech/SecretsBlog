require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
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
	const newUser = new User({
		email: req.body.username,
		password: req.body.password,
	});
	newUser.save(function (err) {
		if (err) console.log(err);
		else res.render("secrets");
	});
});

app.post("/login", function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	User.findOne({ email: username }, function (err, foundUser) {
		if (err) console.log(err);
		else if (foundUser) {
			if (foundUser.password === password) {
				res.render("secrets");
			} else {
				res.render("login", {
					errMsg: "Incorrect password",
					username: username,
					password: password,
				});
			}
		} else {
			res.render("login", {
				errMsg: "Incorrect username",
				username: username,
				password: password,
			});
		}
	});
});

app.listen(3000 || process.env.PORT, function () {
	console.log("Server started successfully");
});
