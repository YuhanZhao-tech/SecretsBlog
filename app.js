require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
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
app.use(
	session({
		secret: "Our little secret.",
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "http://localhost:3000/auth/google/secrets",
			userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
			profileFields: ['id', 'displayName', 'email']
		},
		function (accessToken, refreshToken, profile, cb) {
			console.log(profile);
			User.findOrCreate({ googleId: profile.id, username: profile.id, name: profile.emails[0].value }, function (err, user) {
				return cb(err, user);
			});
			
		}
	)
);

passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: "http://localhost:3000/auth/facebook/secrets",
			profileFields: ['id', 'displayName', 'photos', 'email']
		},
		function (asscessToken, refreshToken, profile, cb) {
			console.log(profile);
			User.findOrCreate({ facebookId: profile.id, username: profile.id, name: profile.emails[0].value }, function (err, user) {
				return cb(err, user);
			});
		}
	)
);

app.get("/", function (req, res) {
	res.render("home");
});

app.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);

app.get(
	"/auth/google/secrets",
	passport.authenticate("google", { failureRedirect: "/login" }),
	function (req, res) {
		res.redirect("/secrets");
	}
);

app.get(
	"/auth/facebook",
	passport.authenticate("facebook", {
		scope: ["email"],
	})
);

app.get(
	"/auth/facebook/secrets",
	passport.authenticate("facebook", { failureRedirect: "/login" }),
	function (req, res) {
		res.redirect("/secrets");
	}
);

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

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

app.get("/secrets", function (req, res) {
	User.find({"secrets": {$ne: null}}, function(err, foundUsers) {
		if (err) console.log(err);
		else if (foundUsers) {
			res.render("secrets", {usersWithSecrets: foundUsers});
		}
	})
});

app.get("/submit", function(req, res) {
	if (req.isAuthenticated()) res.render("submit");
	else res.redirect("/login");
})

app.post("/submit", function(req, res) {
	const submittedSecret = req.body.secret;

	User.findById(req.user.id, function(err, foundUser) {
		if (err) console.log(err);
		else if (foundUser) {
			foundUser.secrets = submittedSecret;
			foundUser.save(function() {
				res.redirect("/secrets");
			});
		}
	})
})

app.post("/register", function (req, res) {
	// User.register is from passport local mongoose
	User.register(
		{ username: req.body.username },
		req.body.password,
		function (err, user) {
			if (err) {
				console.log(err);
				res.redirect("/register");
			} else {
				passport.authenticate("local")(req, res, function () {
					res.redirect("/secrets");
				});
			}
		}
	);
});

app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/secrets",
		faiureRedirect: "/login",
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
