//  Make Oder model
const { Schema, model } = require("mongoose");
const OrderItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    name: String,                
    quantity: { type: Number, default: 1 },
    unit: String,
    price: Number,
    notes: String
}, { timestamps: true });
const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    items: [OrderItemSchema],
    totalAmount: Number,
    currency: { type: String, default: "USD" },
    status: { type: String, default: "pending" } // "pending","completed","cancelled"
}, { timestamps: true });
module.exports= model("Order", OrderSchema);