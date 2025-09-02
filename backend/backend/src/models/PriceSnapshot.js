// models/PriceSnapshot.ts
const { Schema, model } = require("mongoose");

const PriceSnapshotSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product", index: true },
    source: String,                 // "RetailerX"
    price: Number,
    currency: { type: String, default: "USD" },
    capturedAt: { type: Date, index: true }
});

module.exports= model("PriceSnapshot", PriceSnapshotSchema);
