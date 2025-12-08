import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesDao() {
  // Find all quizzes for a specific course
  const findQuizzesForCourse = (courseId) => {
    return model.find({ course: courseId }).sort({ availableDate: 1 });
  };

  // Find a single quiz by ID
  const findQuizById = (quizId) => {
    return model.findById(quizId);
  };

  // Create a new quiz
  const createQuiz = (quiz) => {
    const newQuiz = {
      ...quiz,
      _id: quiz._id || uuidv4(),
      title: quiz.title || "Unnamed Quiz",
      published: false,
      questions: [],
    };
    return model.create(newQuiz);
  };

  // Update a quiz
  const updateQuiz = (quizId, quizUpdates) => {
    return model.updateOne({ _id: quizId }, { $set: quizUpdates });
  };

  // Delete a quiz
  const deleteQuiz = (quizId) => {
    return model.deleteOne({ _id: quizId });
  };

  // Publish/unpublish a quiz
  const togglePublishQuiz = async (quizId) => {
    const quiz = await model.findById(quizId);
    quiz.published = !quiz.published;
    await quiz.save();
    return quiz;
  };

  // Add a question to a quiz
  const addQuestion = async (quizId, question) => {
    const newQuestion = { ...question, _id: uuidv4() };
    await model.updateOne(
      { _id: quizId },
      { $push: { questions: newQuestion } }
    );
    return newQuestion;
  };

  // Update a question in a quiz
  const updateQuestion = async (quizId, questionId, questionUpdates) => {
    const quiz = await model.findById(quizId);
    const question = quiz.questions.id(questionId);
    Object.assign(question, questionUpdates);
    await quiz.save();
    return question;
  };

  // Delete a question from a quiz
  const deleteQuestion = async (quizId, questionId) => {
    const status = await model.updateOne(
      { _id: quizId },
      { $pull: { questions: { _id: questionId } } }
    );
    return status;
  };

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    togglePublishQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
}

