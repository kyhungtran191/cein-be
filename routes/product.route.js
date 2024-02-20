const express = require('express')
const router = express.Router();
const { addProduct, getAllProduct, getDetailProduct, updateProduct, deleteProduct } = require("../controllers/product.ctrl")
const uploader = require("../config/cloudinary.config")
router.route("/").get(getAllProduct).post(uploader.array('images', 10), addProduct)
router.route("/:id").get(getDetailProduct).patch(updateProduct).delete(deleteProduct)

module.exports = router