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

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
})

app.get("/secrets", function(req, res) {
	res.set(
		'Cache-Control',
		'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check-0'
	);
	if (req.isAuthenticated()) res.render("secrets");
	else {
		res.redirect("/login");
	}
})

app.post("/register", function (req, res) {

	// User.register is from passport local mongoose
    User.register({username: req.body.username}, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			res.redirect("/register");
		}
		else {
			passport.authenticate("local")(req, res, function() {
				res.redirect("/secrets");
			})
		}
	})

});

app.post(
	"/login", 
	passport.authenticate("local", {
		successRedirect: "/secrets",
		faiureRedirect: "/login"
	})
	// function (req, res) {
	// 	const user = new User({
	// 		username: req.body.username,
	// 		password: req.body.password
	// 	})

	// 	req.login(user, function(err) {
	// 		if (err) {
	// 			console.log(err);
	// 		} else if (user) {
	// 			passport.authenticate("local")(req, res, function() {
	// 				res.redirect("/secrets");
	// 			})
	// 		} else {
	// 			res.redirect("/login");
	// 		}
	// 	})
	// }
);

app.listen(3000 || process.env.PORT, function () {
	console.log("Server started successfully");
});
