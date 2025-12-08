import AnswersDao from "./dao.js";
import PostsDao from "../Posts/dao.js";

export default function AnswerRoutes(app) {
  const dao = AnswersDao();
  const postsDao = PostsDao();

  // Get all answers for a post
  const findAnswersForPost = async (req, res) => {
    const { postId } = req.params;
    const answers = await dao.findAnswersForPost(postId);
    res.json(answers);
  };

  // Get student answers
  const findStudentAnswers = async (req, res) => {
    const { postId } = req.params;
    const answers = await dao.findStudentAnswers(postId);
    res.json(answers);
  };

  // Get instructor answers
  const findInstructorAnswers = async (req, res) => {
    const { postId } = req.params;
    const answers = await dao.findInstructorAnswers(postId);
    res.json(answers);
  };

  // Create a new answer
  const createAnswer = async (req, res) => {
    const { postId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    // Determine answer type based on user role
    const answerType = currentUser.role === "FACULTY" ? "INSTRUCTOR" : "STUDENT";
    
    const answer = {
      ...req.body,
      post: postId,
      author: currentUser._id,
      answerType,
    };
    
    const newAnswer = await dao.createAnswer(answer);
    res.json(newAnswer);
  };

  // Update an answer
  const updateAnswer = async (req, res) => {
    const { answerId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    // Check if user is author or instructor
    const answer = await dao.findAnswerById(answerId);
    if (answer.author !== currentUser._id && currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }
    
    const status = await dao.updateAnswer(answerId, req.body);
    res.send(status);
  };

  // Delete an answer
  const deleteAnswer = async (req, res) => {
    const { answerId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    // Check if user is author or instructor
    const answer = await dao.findAnswerById(answerId);
    if (answer.author !== currentUser._id && currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }
    
    const status = await dao.deleteAnswer(answerId);
    res.send(status);
  };

  // Register routes
  app.get("/api/pazza/posts/:postId/answers", findAnswersForPost);
  app.get("/api/pazza/posts/:postId/answers/students", findStudentAnswers);
  app.get("/api/pazza/posts/:postId/answers/instructors", findInstructorAnswers);
  app.post("/api/pazza/posts/:postId/answers", createAnswer);
  app.put("/api/pazza/answers/:answerId", updateAnswer);
  app.delete("/api/pazza/answers/:answerId", deleteAnswer);
}

