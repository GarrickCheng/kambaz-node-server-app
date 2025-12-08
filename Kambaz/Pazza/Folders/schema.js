import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  _id: String,
  course: { type: String, required: true }, // Reference to course
  name: { type: String, required: true },
  order: { type: Number, default: 0 }, // For sorting folders
  createdAt: { type: Date, default: Date.now },
}, { collection: "folders" });

export default folderSchema;

