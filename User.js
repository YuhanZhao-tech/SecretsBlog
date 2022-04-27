require('dotenv').config();
const mongoose = require("mongoose");

userSchema = new mongoose.Schema({
    email: String,
    password: String
});


module.exports = new mongoose.model("User", userSchema);