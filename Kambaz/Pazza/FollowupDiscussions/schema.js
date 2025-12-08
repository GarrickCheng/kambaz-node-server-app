import mongoose from "mongoose";

// Reply schema (nested within discussions)
const replySchema = new mongoose.Schema({
  _id: String,
  author: { type: String, required: true }, // Reference to user
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.Mixed }], // Nested replies (recursive)
}, { _id: false });

const followupDiscussionSchema = new mongoose.Schema({
  _id: String,
  post: { type: String, required: true }, // Reference to post
  author: { type: String, required: true }, // Reference to user
  content: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  replies: [replySchema], // Array of replies
}, { collection: "followupdiscussions" });

export default followupDiscussionSchema;
export { replySchema };

