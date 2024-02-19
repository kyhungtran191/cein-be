const Category = require("../models/category.model")
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")


const addCategory = asyncHandler(async (req, res, next) => {
    const { name, featured_image, description } = req.body
    const data = await Category.create({ name, featured_image, description });
    return res.status(200).json({
        message: "Create new Category Successfully!",
        data
    })
})

const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const data = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    })
    data.slug = slugify(data.name, { lower: true, trim: true })
    return res.status(200).json({
        message: "Update category successfully",
        data
    })
})

const getCategories = asyncHandler(async (req, res, next) => {
    const data = await Category.find();
    return res.status(200).json({
        message: "Get Categories Successfully",
        data
    })
})

const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    await Category.findByIdAndDelete(id);
    return res.status(200).json({
        message: "Delete Successfully"
    })
})

module.exports = {
    addCategory,
    updateCategory,
    getCategories,
    deleteCategory
}