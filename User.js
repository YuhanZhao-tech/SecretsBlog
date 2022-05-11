require('dotenv').config();
const findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");


userSchema = new mongoose.Schema({
    googleId: String,
    facebookId: String,
    username: String,
    name: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


module.exports = new mongoose.model("User", userSchema);