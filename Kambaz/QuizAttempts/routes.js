import QuizAttemptsDao from "./dao.js";

export default function QuizAttemptRoutes(app) {
  const dao = QuizAttemptsDao();

  // Get all attempts for a quiz by the current user
  const findAttemptsForUser = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    const attempts = await dao.findAttemptsForUser(quizId, currentUser._id);
    res.json(attempts);
  };

  // Get the latest attempt for the current user
  const findLatestAttempt = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    const attempt = await dao.findLatestAttempt(quizId, currentUser._id);
    res.json(attempt);
  };

  // Start a new attempt
  const createAttempt = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    const attempt = await dao.createAttempt(quizId, currentUser._id);
    res.json(attempt);
  };

  // Submit an attempt with answers
  const submitAttempt = async (req, res) => {
    const { attemptId } = req.params;
    const { answers } = req.body;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    const attempt = await dao.submitAttempt(attemptId, answers);
    res.json(attempt);
  };

  // Get a specific attempt by ID
  const findAttemptById = async (req, res) => {
    const { attemptId } = req.params;
    const attempt = await dao.findAttemptById(attemptId);
    res.json(attempt);
  };

  // Register routes
  app.get("/api/quizzes/:quizId/attempts", findAttemptsForUser);
  app.get("/api/quizzes/:quizId/attempts/latest", findLatestAttempt);
  app.post("/api/quizzes/:quizId/attempts", createAttempt);
  app.put("/api/attempts/:attemptId/submit", submitAttempt);
  app.get("/api/attempts/:attemptId", findAttemptById);
}

