const userRoute = require("./user.route")
const categoryRoute = require("./category.route")
const useRoute = (app) => {
    app.use("/api/v1/auth", userRoute);
    app.use("/api/v1/category", categoryRoute);
}

module.exports = useRoute;