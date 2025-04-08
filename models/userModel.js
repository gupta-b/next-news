const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please add the user name"],
    },
    email: {
        type: String,
        required: [true, "Please add the user email"],
        unique: [true, "email is already register"]
    },
    password: {
        type: String,
        required: [true, "Please add the password"],
    }
},{
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);