import model from "./model.js";
import QuizModel from "../Quizzes/model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizAttemptsDao() {
  // Find all attempts for a quiz by a specific user
  const findAttemptsForUser = (quizId, userId) => {
    return model.find({ quiz: quizId, user: userId }).sort({ attempt: -1 });
  };

  // Find the latest attempt for a user
  const findLatestAttempt = async (quizId, userId) => {
    const attempts = await model.find({ quiz: quizId, user: userId }).sort({ attempt: -1 }).limit(1);
    return attempts[0] || null;
  };

  // Create a new attempt
  const createAttempt = async (quizId, userId) => {
    const existingAttempts = await model.find({ quiz: quizId, user: userId });
    const attemptNumber = existingAttempts.length + 1;
    
    const newAttempt = {
      _id: uuidv4(),
      quiz: quizId,
      user: userId,
      attempt: attemptNumber,
      answers: [],
      score: 0,
      startedAt: new Date(),
    };
    
    return model.create(newAttempt);
  };

  // Submit an attempt with answers
  const submitAttempt = async (attemptId, answers) => {
    const attempt = await model.findById(attemptId);
    attempt.answers = answers;
    attempt.submittedAt = new Date();
    
    // Calculate score
    const quiz = await QuizModel.findById(attempt.quiz);
    let score = 0;
    
    answers.forEach(answer => {
      const question = quiz.questions.id(answer.questionId);
      if (!question) return;
      
      let isCorrect = false;
      
      if (question.type === "MULTIPLE_CHOICE") {
        // Check if selected choice is correct
        const selectedChoice = question.choices.find(c => c.text === answer.answer);
        isCorrect = selectedChoice && selectedChoice.isCorrect;
      } else if (question.type === "TRUE_FALSE") {
        isCorrect = answer.answer === question.correctAnswer;
      } else if (question.type === "FILL_IN_BLANK") {
        // Check if answer matches any possible answer (case insensitive)
        isCorrect = question.possibleAnswers.some(
          possible => possible.toLowerCase() === answer.answer.toLowerCase()
        );
      }
      
      if (isCorrect) {
        score += question.points;
      }
    });
    
    attempt.score = score;
    await attempt.save();
    return attempt;
  };

  // Get attempt by ID
  const findAttemptById = (attemptId) => {
    return model.findById(attemptId);
  };

  return {
    findAttemptsForUser,
    findLatestAttempt,
    createAttempt,
    submitAttempt,
    findAttemptById,
  };
}

