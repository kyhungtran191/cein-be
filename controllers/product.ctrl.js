const Product = require("../models/product.model")
const asyncHandler = require("express-async-handler")
const handleFilterImages = require("../utils/filterProductFiled")
const { ORDER, SORT_BY } = require("../constants/product")
const Category = require("../models/category.model")
const mongoose = require("mongoose")
const { Types: { ObjectId } } = require('mongoose');
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
    const { name, description, category, price, isFeatured, vars } = req.body
    const { id } = req.params
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, category, price, isFeatured, vars }, { new: true, runValidators: true })
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
    let {
        page = 1,
        limit = 30,
        category,
        sort_by,
        order,
        rating_filter,
        size,
        price_max,
        price_min,
        color,
        name,
    } = req.query;
    page = Number(page)
    limit = Number(limit)
    let condition = {}
    if (category) {
        let categorieSlug = category.split(',');
        let categoriesList = await Category.find({ slug: { $in: categorieSlug } })
        let catIds = categoriesList.map((item) => item._id.toString())
        condition.category = { $in: catIds }
    }
    if (rating_filter) {
        condition.rating = { $gte: rating_filter }
    }
    if (price_max) {
        condition.price = {
            $lte: price_max,
        }
    }
    if (size && !color) {
        condition.vars = {
            $elemMatch: {
                'sizes': {
                    $elemMatch: {
                        'name': size
                    }
                }
            }
        }
    }
    if (color && !size) {
        condition.vars = { $elemMatch: { color: color } }
    }
    if (color && size) {
        condition.vars = {
            $elemMatch: {
                'color': color,
                'sizes': {
                    $elemMatch: {
                        'name': size
                    }
                }
            }
        }
    }

    if (price_min) {
        condition.price = condition.price
            ? { ...condition.price, $gte: price_min }
            : { $gte: price_min }
    }
    if (!ORDER.includes(order)) {
        order = ORDER[0]
    }
    if (!SORT_BY.includes(sort_by)) {
        sort_by = SORT_BY[0]
    }
    if (name) {
        condition.name = {
            $regex: name,
            $options: 'i',
        }
    }
    let [products, totalProducts] =
        await Promise.all([
            Product.find(condition)
                .populate({
                    path: 'category',
                })
                .sort({ [sort_by]: order === 'desc' ? -1 : 1 })
                .skip(page * limit - limit)
                .limit(limit)
                .select({ __v: 0, description: 0 })
                .lean(),
            Product.find(condition).countDocuments().lean(),
        ])
    // const page_size = Math.ceil(totalProducts / limit) || 1
    return res.status(200).json({
        message: "Get all products successfully",
        data: {
            products,
            pagination: {
                page,
                total: totalProducts
            },
        },
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