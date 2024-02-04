const express = require('express');
const app = express();
const helmet = require("helmet")
require("dotenv").config();
const morgan = require("morgan")
const route = require("./routes");
const db = require("./config/db")
//??
app.use(morgan("common"))
//PORT
const PORT = process.env.PORT || 5000;

//??
app.use(helmet());
//db
db();
//route
route(app);

//server start
app.listen(PORT, () => {
    console.log("Server running at " + PORT);
});