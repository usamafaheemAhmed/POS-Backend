const Express = require("express");
const MyRouter = Express.Router();

const UserDetails = require("../../model/Users/Users");
const UserSchema = require("../../schema/Users/UsersSchema");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Authentication (Login) handler
const handleAuth = async (req, res) => {
    // console.log("ma chala")
    const email = req.body.email;
    const pwd = req.body.password;

    if (!email || !pwd) {
        return res.status(400).json({ "message": "User phone number and password are required" });
    }

    const foundUser = await UserDetails.findOne({ email: email }).exec();

    if (!foundUser) return res.status(404).json({ "message": "User doesn't exist" });

    const match = await bcrypt.compare(pwd, foundUser.password);

    if (match) {

        // Create access token
        const accessToken = jwt.sign(
            {
                "Userinfo": foundUser,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "2h" }
        );

        // Create refresh token
        const refreshToken = jwt.sign(
            { "id": foundUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "5d" }
        );

        // Save refresh token with user
        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        // Set secure httpOnly cookie for refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });

        res.status(200).json({ accessToken });
    } else {
        res.status(401).json({ "message": "Unauthorized: Password does not match" });
    }
};


// Define routes
MyRouter.post("/", handleAuth);
// MyRouter.post("/register", handleRegistration);

module.exports = MyRouter;
