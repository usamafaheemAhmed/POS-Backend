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

// Registration (Sign-up) handler
const handleRegistration = async (req, res) => {
    const { phone_number, password, account_type } = req.body;

    if (!phone_number || !password || !account_type) {
        return res.status(400).json({ "message": "Phone number, password, and account type are required" });
    }

    // Validate request data against user schema
    const { error } = UserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Check if user already exists
        const existingUser = await UserDetails.findOne({ phone_number });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user document
        const newUser = new UserDetails({
            phone_number,
            password: hashedPassword,
            account_type,
            roles: ["User"], // Default role, adjust as needed
            // Include other fields if necessary
        });

        const savedUser = await newUser.save();

        // Send full user data (excluding password)
        const userData = {
            id: savedUser._id,
            phone_number: savedUser.phone_number,
            account_type: savedUser.account_type,
            roles: savedUser.roles,
            // Include other fields if necessary
        };

        res.status(201).json({ message: "User registered successfully", user: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Define routes
MyRouter.post("/", handleAuth);
// MyRouter.post("/register", handleRegistration);

module.exports = MyRouter;
