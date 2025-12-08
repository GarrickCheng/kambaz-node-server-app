import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema({
  _id: String,
  quiz: { type: String, required: true }, // Reference to quiz
  user: { type: String, required: true }, // Reference to user
  attempt: { type: Number, default: 1 }, // Attempt number (1, 2, 3, etc.)
  
  // Answers for each question
  answers: [{
    questionId: String,
    answer: mongoose.Schema.Types.Mixed, // Can be string, boolean, array, etc.
  }],
  
  // Scoring
  score: { type: Number, default: 0 },
  
  // Timestamps
  startedAt: { type: Date, default: Date.now },
  submittedAt: Date,
}, { collection: "quizattempts" });

export default quizAttemptSchema;

