import FollowupDiscussionsDao from "./dao.js";

export default function FollowupDiscussionRoutes(app) {
  const dao = FollowupDiscussionsDao();

  // Get all discussions for a post
  const findDiscussionsForPost = async (req, res) => {
    const { postId } = req.params;
    const discussions = await dao.findDiscussionsForPost(postId);
    res.json(discussions);
  };

  // Create a new discussion
  const createDiscussion = async (req, res) => {
    const { postId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    const discussion = {
      ...req.body,
      post: postId,
      author: currentUser._id,
    };
    
    const newDiscussion = await dao.createDiscussion(discussion);
    res.json(newDiscussion);
  };

  // Update a discussion
  const updateDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    // Check if user is author or instructor
    const discussion = await dao.findDiscussionById(discussionId);
    if (discussion.author !== currentUser._id && currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }
    
    const status = await dao.updateDiscussion(discussionId, req.body);
    res.send(status);
  };

  // Toggle resolved status
  const toggleResolved = async (req, res) => {
    const { discussionId } = req.params;
    const discussion = await dao.toggleResolved(discussionId);
    res.json(discussion);
  };

  // Delete a discussion
  const deleteDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    // Check if user is author or instructor
    const discussion = await dao.findDiscussionById(discussionId);
    if (discussion.author !== currentUser._id && currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }
    
    const status = await dao.deleteDiscussion(discussionId);
    res.send(status);
  };

  // Add a reply to a discussion
  const addReply = async (req, res) => {
    const { discussionId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    const reply = {
      ...req.body,
      author: currentUser._id,
    };
    
    const newReply = await dao.addReply(discussionId, reply);
    res.json(newReply);
  };

  // Add a nested reply (reply to a reply)
  const addNestedReply = async (req, res) => {
    const { discussionId, replyId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    const reply = {
      ...req.body,
      author: currentUser._id,
    };
    
    const newReply = await dao.addNestedReply(discussionId, replyId, reply);
    res.json(newReply);
  };

  // Update a reply
  const updateReply = async (req, res) => {
    const { discussionId, replyId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    const discussion = await dao.updateReply(discussionId, replyId, req.body);
    res.json(discussion);
  };

  // Delete a reply
  const deleteReply = async (req, res) => {
    const { discussionId, replyId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    const discussion = await dao.deleteReply(discussionId, replyId);
    res.json(discussion);
  };

  // Register routes
  app.get("/api/pazza/posts/:postId/discussions", findDiscussionsForPost);
  app.post("/api/pazza/posts/:postId/discussions", createDiscussion);
  app.put("/api/pazza/discussions/:discussionId", updateDiscussion);
  app.put("/api/pazza/discussions/:discussionId/toggle-resolved", toggleResolved);
  app.delete("/api/pazza/discussions/:discussionId", deleteDiscussion);
  app.post("/api/pazza/discussions/:discussionId/replies", addReply);
  app.post("/api/pazza/discussions/:discussionId/replies/:replyId", addNestedReply);
  app.put("/api/pazza/discussions/:discussionId/replies/:replyId", updateReply);
  app.delete("/api/pazza/discussions/:discussionId/replies/:replyId", deleteReply);
}

