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
    featured_image: String,
    images: [{ type: String }],
    description: {
        type: String,
        required: [true, 'Please provide description about the product']
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        max: [100000000, 'Product max price can be 1000000000'],
    },
    view: {
        type: Number,
        default: 0
    },
    ratings: [{
        star: {
            type: Number,
            required: [true, 'Please provide score']
        },
        comment: {
            type: String,
            required: [true, 'Please provide comment about product']
        },
        posted_by: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    slug: String,
    sold: {
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
    },
    skus: [
        {
            color: String,
            hex: String,
            sizes: [{
                name: String,
                quantity: Number
            }]
        }
    ]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});


productSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true, trim: true })
    next();
})

module.exports = productSchema