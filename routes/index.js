const userRoute = require("./user.route")
const categoryRoute = require("./category.route")
const productRoute = require("./product.route")
const useRoute = (app) => {
    app.use("/api/v1/auth", userRoute);
    app.use("/api/v1/category", categoryRoute);
    app.use("/api/v1/product", productRoute)
}

module.exports = useRoute;