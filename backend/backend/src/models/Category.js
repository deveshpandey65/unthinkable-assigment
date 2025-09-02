// models/Category.js
const { Schema, model } = require("mongoose");

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        products: [{
            type: Schema.Types.ObjectId,
            ref: "Product",
            default: []
        }],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true } // automatically adds createdAt & updatedAt
);

module.exports = model("Category", CategorySchema);
