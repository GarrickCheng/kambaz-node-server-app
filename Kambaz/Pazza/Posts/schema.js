import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  _id: String,
  course: { type: String, required: true }, // Reference to course
  type: {
    type: String,
    enum: ["QUESTION", "NOTE"],
    default: "QUESTION"
  },
  author: { type: String, required: true }, // Reference to user
  
  // Visibility
  postTo: {
    type: String,
    enum: ["ENTIRE_CLASS", "INDIVIDUAL"],
    default: "ENTIRE_CLASS"
  },
  visibleTo: [String], // Array of user IDs (only if postTo is INDIVIDUAL)
  
  // Content
  summary: { type: String, required: true, maxLength: 100 },
  details: { type: String, required: true }, // HTML from Rich Text Editor
  
  // Folders
  folders: [String], // Array of folder names, at least one required
  
  // Metadata
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { collection: "posts" });

export default postSchema;

