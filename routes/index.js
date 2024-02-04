const userRoute = require("./user.route")
const useRoute = (app) => {
    app.use("/api/v1/auth", userRoute);
}

module.exports = useRoute;