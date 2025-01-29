const Express = require("express");
const MyRouter = Express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = require("../model/Users/Users");
const usersSchema = require("../schema/Users/UsersSchema");

// Middleware to check if user is logged in
const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("Unauthorized");

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send("Forbidden");
        req.user = user;
        next();
    });
};

// Add a new user
MyRouter.post("/Add", async (req, res) => {
    const NewUser = req.body;
    // console.log(NewUser);
    if (req.user) {
        // If user is already logged in, send a success message
        return res.status(200).send({ message: "User already logged in" });
    }

    const { error } = usersSchema(NewUser); // Assuming usersSchema is a Joi schema
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    try {
        const existingUser = await users.findOne({ email: NewUser.email });
        if (existingUser) {
            return res.status(409).send({ message: "User Already Exists" });
        }

        const hashedPwd = await bcrypt.hash(NewUser.password, 10);
        NewUser.password = hashedPwd;

        let AddUser = new users(NewUser);
        AddUser = await AddUser.save();

        // If registration is successful, generate an access token
        const accessToken = jwt.sign(
            { Userinfo: AddUser },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "2h" }
        );

        res.status(201).json({ accessToken, message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Update user data
MyRouter.patch("/Update/:id", checkAuth, async (req, res) => {
    try {
        const UpdateUser = await users.findOne({ _id: req.params.id });

        if (!UpdateUser) {
            return res.status(404).send("User not found");
        }

        if (req.user.userId !== req.params.id) {
            return res.status(403).send("Unauthorized to update this user");
        }

        // Update the user's fields with new values from req.body
        Object.assign(UpdateUser, {
            userName: req.body.userName || UpdateUser.userName,
            email: req.body.email || UpdateUser.email,
            phoneNumber: req.body.phoneNumber || UpdateUser.phoneNumber,
            gender: req.body.gender || UpdateUser.gender,
            address: req.body.address || UpdateUser.address,
            accountType: req.body.accountType || UpdateUser.accountType,
        });

        const updatedUser = await UpdateUser.save();
        res.status(200).send({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Get all users
MyRouter.get("/", async (req, res) => {
    try {
        const allUsers = await users.find();
        res.send(allUsers);
    } catch (err) {
        res.status(500).send("Error: " + err);
    }
});

// Get a single user
MyRouter.get("/:id", async (req, res) => {
    try {
        const user = await users.findById(req.params.id);
        if (!user) return res.status(404).send("User not found");
        res.send(user);
    } catch (err) {
        res.status(500).send("Error: " + err);
    }
});

// Delete a user
MyRouter.delete("/Delete/:id", async (req, res) => {
    try {
        const user = await users.findById(req.params.id);
        if (!user) return res.status(404).send("User not found");

        await user.remove();
        res.send({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
});

module.exports = MyRouter;
