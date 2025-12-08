import mongoose from "mongoose";
import questionSchema from "./questionSchema.js";

const quizSchema = new mongoose.Schema({
  _id: String,
  title: { type: String, default: "Unnamed Quiz" },
  description: String,
  course: { type: String, required: true }, // Reference to course
  
  // Quiz Settings
  quizType: {
    type: String,
    enum: ["GRADED_QUIZ", "PRACTICE_QUIZ", "GRADED_SURVEY", "UNGRADED_SURVEY"],
    default: "GRADED_QUIZ"
  },
  points: { type: Number, default: 0 }, // Sum of all question points
  assignmentGroup: {
    type: String,
    enum: ["QUIZZES", "EXAMS", "ASSIGNMENTS", "PROJECT"],
    default: "QUIZZES"
  },
  shuffleAnswers: { type: Boolean, default: true },
  timeLimit: { type: Number, default: 20 }, // in minutes
  multipleAttempts: { type: Boolean, default: false },
  howManyAttempts: { type: Number, default: 1 },
  showCorrectAnswers: { type: String, default: "IMMEDIATELY" },
  accessCode: { type: String, default: "" },
  oneQuestionAtATime: { type: Boolean, default: true },
  webcamRequired: { type: Boolean, default: false },
  lockQuestionsAfterAnswering: { type: Boolean, default: false },
  
  // Dates
  dueDate: Date,
  availableDate: Date,
  untilDate: Date,
  
  // Publishing
  published: { type: Boolean, default: false },
  
  // Questions (embedded)
  questions: [questionSchema],
}, { collection: "quizzes" });

export default quizSchema;

