const express = require('express');
const app = express();
const helmet = require("helmet")
require("dotenv").config();
const morgan = require("morgan")
const route = require("./routes");
const path = require('path');
const db = require("./config/db")
const { errHandler, notFound } = require("./config/errorGlobalHandler")
const cors = require('cors')
//??
app.use(morgan("common"))
//PORT
const PORT = process.env.PORT || 5000;
app.use(express())
//??
app.use(helmet());
//db
db();
//json format
app.use(cors({
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//route
route(app);
app.all("*", notFound)
app.use(errHandler)
//server start
app.listen(PORT, () => {
    console.log("Server running at " + PORT);
});