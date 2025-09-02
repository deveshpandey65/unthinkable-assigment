// models/ShoppingList.ts
const { Schema, model } = require("mongoose");

const ListItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    name: String,                 // fallback if productId null
    category: String,             // denormalized for quick grouping
    quantity: { type: Number, default: 1 },
    price: Number,
    notes: String,
    image:String
}, { timestamps: true });

const ShoppingListSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    items: [ListItemSchema],
    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports= model("ShoppingList", ShoppingListSchema);
