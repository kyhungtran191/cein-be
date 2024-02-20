const Product = require("../models/product.model")
const asyncHandler = require("express-async-handler")
const handleFilterImages = require("../utils/filterProductFiled")

const addProduct = asyncHandler(async (req, res, next) => {
    const { name, description, category, vars, price } = req.body;
    console.log(name, description, category, vars)
    let images = []
    if (req.files && req.files.length > 0) {
        images = handleFilterImages(req.files)
    }
    const data = await Product.create({ name, description, category, vars, images, price })
    return res.status(200).json({
        message: "success",
        data
    })
});

const updateProduct = asyncHandler(async (req, res, next) => {
    const { name, description, category, price, isFeatured } = req.body
    const updatedProduct = await Product.findByIdAndUpdate(pid, { name, description, category, price, isFeatured }, { new: true, runValidators: true })
    return res.status(200).json({
        message: "Update successfully!",
        data: updatedProduct
    })

})

const getDetailProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await Product.findOne({ _id: id })
    if (data) {
        return res.status(200).json({
            message: "Get detail product successfully",
            data
        })
    } else {
        return next(new Error("Can not find this product Id"))
    }
})

const getAllProduct = asyncHandler(async (req, res, next) => {
    const data = await Product.find();
    return res.status(200).json({
        message: "Get all products successfully",
        data
    })
})

const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    await Product.findOneAndDelete({ _id: id });
    return res.status(201).json({
        message: "Delete product successfully"
    })
})

const ratingProduct = asyncHandler(async (req, res, next) => {
    const { star, comment, product_id } = req.body;
    const product = await Product.findOne({ _id: product_id })
    if (!product) return next(new Error("This product_id is not exist"))
    const isAlreadyExist = product.ratings.find((item) => item.posted_by.toString() == req.user._id);
    if (isAlreadyExist) {
        const ratingsUpdate = await Product.updateOne(
            { "ratings": { $elemMatch: isAlreadyExist } },
            { $set: { "ratings.$.star": star, "ratings.$.comment": comment } }
        );
        return res.status(200).json({
            message: "Update rating successfully!",
            data: ratingsUpdate
        })
    } else {
        const rating = await Product.findOneAndUpdate({ _id: product._id }, {
            $push: {
                ratings: { star, comment, postedBy: req.user._id }
            }
        })
        return res.status(200).json({
            message: "Post new rating successfully",
            data: rating
        })
    }
})

module.exports = {
    addProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    ratingProduct
}