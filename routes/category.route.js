const express = require("express")
const router = express.Router();
const { addCategory, deleteCategory, getCategories, updateCategory } = require("../controllers/category.ctrl")
router.route('/').get(getCategories).post(addCategory)
router.route('/:id').patch(updateCategory).delete(deleteCategory);

module.exports = router