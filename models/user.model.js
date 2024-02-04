const mongoose = require('mongoose');
const validator = require('validator');
const ROLES = require("../config/role")
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please provide your name"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: "Please provide exactly email format"
        }
    },
    password: {
        type: String,
        required: [true, "Please provide your password"],
        min: [6, "Password must be at least 6 characters"]
    },
    confirm_password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value === this.password
            },
            message: 'Mật khẩu không khớp'
        }
    },
    role: {
        type: String,
        default: ROLES.USER,
        enum: { values: [ROLES.USER, ROLES.ADMIN], message: "Role vừa chọn không thuộc trong hệ thống" },
    },
    address: String,
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods = {
    isMatch: async function (password) {
        console.log(password)
        console.log(this.password)
        return await bcrypt.compare(password, this.password)
    },
    resetTokenGenerate: function () {
        const resetTokenString = crypto.lib.WordArray.random(32).toString(crypto.enc.Hex);
        this.passwordResetToken = crypto.SHA256(resetTokenString).toString(crypto.enc.Hex);
        this.passwordResetExpired = Date.now() + 15 * 60 * 1000; //15 minutes
        return resetTokenString;
    }
}

module.exports = mongoose.model("User", userSchema)
