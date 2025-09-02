// models/PurchaseHistory.ts
const { Schema, model } = require("mongoose");

const PurchaseHistorySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", index: true },
    qty: Number,
    purchasedAt: { type: Date, index: true }
}, { timestamps: true });

module.exports= model("PurchaseHistory", PurchaseHistorySchema);
