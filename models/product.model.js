const mongoose = require('mongoose')
const slugify = require('slugify')
const { Schema } = mongoose
// Declare the Schema of the Mongo model
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide description about the product']
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        max: [100000000, 'Product max price can be 1000000000'],
    },
    slug: String,
    sold: {
        type: Number,
        default: 0
    },
    ratingScore: {
        type: Number,
        default: 0
    },
    ratingTotal: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Please provide category id']
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});



module.exports = productSchema