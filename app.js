const express = require('express');
var cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
let cookieParser = require('cookie-parser');
require('dotenv').config();

const { logger, errorHandler } = require('./middleware/logger');
const verifyJWT = require('./middleware/verifyJWT');
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(logger);

const Mongoose = require("mongoose");
// const url = "mongodb://127.0.0.1/BismilaFastFood";
const url = process.env.mongoURI || "mongodb://127.0.0.1/BismilaFastFood";

Mongoose.connect(url, { useNewUrlParser: true });
const Mongo = Mongoose.connection;

Mongo.on("open", () => {
    console.log("MongoDB Connected!");
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/images', express.static('images'))


app.use("/api/Register", require('./Route/Register'));

//User Authentication
app.use("/api/Login", require('./Route/auth/auth'));
app.use("/api/logout", require('./Route/auth/logout'));

// app.use("/api/refresh", require('./Route/auth/refresh'));
app.use(verifyJWT);


// Routes
app.use('/api/BismillahAllInOne', require('./Route/BismillahAllInOne.js'));



// for unknown API address 
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});