// models/VoiceTranscript.ts
const { Schema, model } = require("mongoose");

const VoiceTranscriptSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    lang: { type: String, default: "en" },
    text: String,
    intents: [String],        // ["add_item","remove_item","find_item"]
    entities: Schema.Types.Mixed, // { item:"milk", qty:2, unit:"bottles" }
    raw: Schema.Types.Mixed,  // full ASR/NLP payload
    status: { type: String, enum: ["received", "parsed", "actioned"], default: "received" }
}, { timestamps: true });

module.exports= model("VoiceTranscript", VoiceTranscriptSchema);
