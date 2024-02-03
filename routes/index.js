const userRoute = require("./user.route")
const useRoute = (app) => {
    app.use("/user", userRoute);
}

module.exports = useRoute;