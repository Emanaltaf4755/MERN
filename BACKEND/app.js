const express = require("express");

const app = express();

const errormiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser")

app.use(express.json());

app.use(cookieParser())

// route import
const product = require("./routes/productRoute");
const user = require("./routes/userRoutes")

app.use("/api/v1", product);
app.use("/api/v1",user)

// middleware for errors
app.use(errormiddleware);

module.exports = app;
