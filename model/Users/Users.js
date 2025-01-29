const Mongoose = require("mongoose");

const User = new Mongoose.Schema({

    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String,
    },
    gender: {
        type: String
    },
    phone: {
        type: String
    },
    Roll: {
        type: String,
        default: "client",
    },
    subscription: {
        type: String,
        default: "1 year",
    },
    refreshToken: {
        type: String,
        default: "",
    }

});

module.exports = Mongoose.model("User", User);