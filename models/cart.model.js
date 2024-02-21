const mongoose = require("mongoose")
const { Schema } = mongoose
const CartItem = new Schema({
    product_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    color: String,
    size: String,
    quantity: String,
    items_price: Number
}, {
    timestamps: true
})
const Cart = new Schema({
    status: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    products: [CartItem],
    totalPrice: Number
})
module.exports = mongoose.model(Cart)