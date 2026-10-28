
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
    },

    description: {
        type: String,
        required: [true, "Please enter product description"],
    },

    price: {
        type: Number,
        required: [true, "Please enter product price"],
        max: [99999999, "Price cannot exceed 8 digits"],
    },

    ratings: {
        type: Number,
        default: 0,
    },

    image: [
        {
            public_id: {
                type: String,
                required: true,
            },

            url: {
                type: String,
                required: true,
            },
        },
    ],

    category: {
        type: String,
        required: [true, "Please enter product category"],
    },

    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        max: [9999, "Stock cannot exceed 4 digits"],
        default: 1,
    },

    numOfReviews: [
        {
            name: {
                type: String,
                required: true,
            },

            ratings: {
                type: Number,
                required: true,
            },

            comment: {
                type: String,
                required: true,
            },
        },
    ],
user: {
    type:mongoose.Schema.ObjectId,
    ref:"user",
    required: true,
},
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Product", productSchema);