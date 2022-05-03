require('dotenv').config();
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");

userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);


module.exports = new mongoose.model("User", userSchema);