const express = require('express');
const router = express.Router();

const userDB = require("../../model/Users/Users");

const handleLogout = async (req, res) => {
    // Check for JWT cookie
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        // Use 204 (No Content) to indicate no cookie present for logout
        return res.status(204).json({ "message": "No token to clear" });
    }

    const refreshToken = cookies.jwt;
    const foundUser = await userDB.findOne({ refreshToken }).exec();

    // Clear cookie and respond if no user found
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: "None", secure: true });
        return res.status(204).json({ "message": "No user with this token" });
    }

    // Remove refreshToken from user document
    foundUser.refreshToken = "";
    await foundUser.save();

    // Clear JWT cookie
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: "None",
        secure: true,
    });

    // Return 204 No Content for successful logout
    res.status(204).json({ "message": "Successfully logged out" });
};

// Define logout route
router.get('/', handleLogout);

module.exports = router;
