const express = require('express');
const app = express();
const helmet = require("helmet")
require("dotenv").config();
const morgan = require("morgan")
const route = require("./routes");

app.use(morgan("common"))
const PORT = process.env.PORT || 5000;


app.use(helmet());
route(app);


app.listen(PORT, () => {
    console.log("Server running at " + PORT);
});