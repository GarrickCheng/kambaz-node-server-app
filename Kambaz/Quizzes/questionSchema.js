import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: String,
  type: {
    type: String,
    enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_IN_BLANK"],
    default: "MULTIPLE_CHOICE"
  },
  title: { type: String, default: "Untitled Question" },
  points: { type: Number, default: 1 },
  question: String, // The actual question text (can be HTML from WYSIWYG)
  
  // For Multiple Choice
  choices: [{
    text: String,
    isCorrect: { type: Boolean, default: false }
  }],
  
  // For True/False
  correctAnswer: Boolean, // true or false
  
  // For Fill in the Blank
  possibleAnswers: [String], // Array of possible correct answers
}, { _id: false });

export default questionSchema;

