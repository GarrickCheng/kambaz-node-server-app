import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  _id: String,
  post: { type: String, required: true }, // Reference to post
  author: { type: String, required: true }, // Reference to user
  answerType: {
    type: String,
    enum: ["STUDENT", "INSTRUCTOR"],
    required: true
  },
  content: { type: String, required: true }, // HTML from Rich Text Editor
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { collection: "answers" });

export default answerSchema;

