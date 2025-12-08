import QuizzesDao from "./dao.js";

export default function QuizRoutes(app) {
  const dao = QuizzesDao();

  // Get all quizzes for a course
  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };

  // Get a single quiz by ID
  const findQuizById = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    res.json(quiz);
  };

  // Create a new quiz
  const createQuiz = async (req, res) => {
    const { courseId } = req.params;
    const quiz = {
      ...req.body,
      course: courseId,
    };
    const newQuiz = await dao.createQuiz(quiz);
    res.json(newQuiz);
  };

  // Update a quiz
  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const quizUpdates = req.body;
    const status = await dao.updateQuiz(quizId, quizUpdates);
    res.send(status);
  };

  // Delete a quiz
  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.deleteQuiz(quizId);
    res.send(status);
  };

  // Toggle publish/unpublish a quiz
  const togglePublishQuiz = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.togglePublishQuiz(quizId);
    res.json(quiz);
  };

  // Add a question to a quiz
  const addQuestion = async (req, res) => {
    const { quizId } = req.params;
    const question = req.body;
    const newQuestion = await dao.addQuestion(quizId, question);
    res.json(newQuestion);
  };

  // Update a question in a quiz
  const updateQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const questionUpdates = req.body;
    const question = await dao.updateQuestion(quizId, questionId, questionUpdates);
    res.json(question);
  };

  // Delete a question from a quiz
  const deleteQuestion = async (req, res) => {
    const { quizId, questionId } = req.params;
    const status = await dao.deleteQuestion(quizId, questionId);
    res.send(status);
  };

  // Register routes
  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:quizId", findQuizById);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.put("/api/quizzes/:quizId/publish", togglePublishQuiz);
  
  // Question routes
  app.post("/api/quizzes/:quizId/questions", addQuestion);
  app.put("/api/quizzes/:quizId/questions/:questionId", updateQuestion);
  app.delete("/api/quizzes/:quizId/questions/:questionId", deleteQuestion);
}

