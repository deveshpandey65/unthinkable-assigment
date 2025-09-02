// models/Product.ts
const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
    name: { type: String, index: "text" },
    category: { type: String, index: true }, // "dairy","produce","snacks"
    tags: [String],                          // "organic","lactose-free"
    brand: String,
    quantity: Number,                     // 1.5
    unit: String,                            // "bottle","kg","pack"
    image:String,
    variants: [{ size: String, upc: String }],
    seasonMonths: [Number],                  // [11,12,1] for winter items
    substitutions: [Schema.Types.ObjectId],  // other Product _ids
}, { timestamps: true });

module.exports= model("Product", ProductSchema);
