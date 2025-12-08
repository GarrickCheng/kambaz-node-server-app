import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AnswersDao() {
  // Find all answers for a post
  const findAnswersForPost = (postId) => {
    return model.find({ post: postId }).sort({ createdAt: 1 });
  };

  // Find student answers for a post
  const findStudentAnswers = (postId) => {
    return model.find({ post: postId, answerType: "STUDENT" }).sort({ createdAt: 1 });
  };

  // Find instructor answers for a post
  const findInstructorAnswers = (postId) => {
    return model.find({ post: postId, answerType: "INSTRUCTOR" }).sort({ createdAt: 1 });
  };

  // Create a new answer
  const createAnswer = (answer) => {
    const newAnswer = {
      ...answer,
      _id: answer._id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return model.create(newAnswer);
  };

  // Update an answer
  const updateAnswer = (answerId, answerUpdates) => {
    return model.updateOne(
      { _id: answerId },
      { $set: { ...answerUpdates, updatedAt: new Date() } }
    );
  };

  // Delete an answer
  const deleteAnswer = (answerId) => {
    return model.deleteOne({ _id: answerId });
  };

  // Get answer by ID
  const findAnswerById = (answerId) => {
    return model.findById(answerId);
  };

  return {
    findAnswersForPost,
    findStudentAnswers,
    findInstructorAnswers,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    findAnswerById,
  };
}

