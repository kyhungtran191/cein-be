const express = require('express');
const app = express();
const helmet = require("helmet")
require("dotenv").config();
const morgan = require("morgan")

app.use(morgan("common"))
const PORT = process.env.PORT || 5000;


app.use(helmet());

app.get("/", (req, res, next) => {
    res.json("This is the Homepage")
});

app.listen(PORT, () => {
    console.log("Server running at " + PORT);
});