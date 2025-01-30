const jwt = require('jsonwebtoken');
const { unauthorizedAccessAttempt } = require('./logger');
require('dotenv').config();

const verifyJWT = (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        unauthorizedAccessAttempt(req);
        // return res.status(401).json({ "message": "You are unauthorized for this task" })
        return res.status(404).json({ "message": "Not found JWT" })
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403);

            req.id = decoded.Userinfo._id;
            req.roles = decoded.Userinfo.roles;


            next();
        }
    )
}

module.exports = verifyJWT;