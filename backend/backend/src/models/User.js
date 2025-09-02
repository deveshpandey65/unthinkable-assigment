// models/User.ts
const { Schema, model } = require("mongoose");
const PreferenceSchema = new Schema({
    likes: [String] ,
    disliked: [String],          
    preferredBrands: [String],
    locales: { type: [String], default: ["en"] }
}, { _id: false });

const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true, index: true },
    passwordHash: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    preferences: PreferenceSchema,
    lastActiveAt: Date
}, { timestamps: true });
module.exports= model("User", UserSchema);
