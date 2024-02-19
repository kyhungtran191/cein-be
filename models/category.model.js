const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');
const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, ""],
        unique: [true, "This category name is already exists!"]
    },
    description: String,
    featured_image: String,
    slug: String,
})

categorySchema.pre("post", function (next) {
    this.slug = slugify(this.name, { lower: true, trim: true })
    next();
})

module.exports = mongoose.model("Category", categorySchema)


