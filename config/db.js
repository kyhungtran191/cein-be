const mongoose = require("mongoose")
const dbConnect = async () => {
    try {
        const result = await mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB");
    }
    catch (err) {
        console.log(err);
    }
}
module.exports = dbConnect;