import PostsDao from "./dao.js";

export default function PostRoutes(app) {
  const dao = PostsDao();

  // Get all posts for a course (with filters)
  const findPostsForCourse = async (req, res) => {
    const { courseId } = req.params;
    const { folder, search } = req.query;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    const posts = await dao.findPostsForCourse(
      courseId,
      currentUser._id,
      currentUser.role,
      folder,
      search
    );
    res.json(posts);
  };

  // Get a single post by ID
  const findPostById = async (req, res) => {
    const { postId } = req.params;
    const post = await dao.findPostById(postId);
    
    if (post) {
      // Increment view count
      await dao.incrementViews(postId);
    }
    
    res.json(post);
  };

  // Create a new post
  const createPost = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    const post = {
      ...req.body,
      course: courseId,
      author: currentUser._id,
    };
    
    const newPost = await dao.createPost(post);
    res.json(newPost);
  };

  // Update a post
  const updatePost = async (req, res) => {
    const { postId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    // Check if user is author or instructor
    const post = await dao.findPostById(postId);
    if (post.author !== currentUser._id && currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }
    
    const status = await dao.updatePost(postId, req.body);
    res.send(status);
  };

  // Delete a post
  const deletePost = async (req, res) => {
    const { postId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    // Check if user is author or instructor
    const post = await dao.findPostById(postId);
    if (post.author !== currentUser._id && currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }
    
    const status = await dao.deletePost(postId);
    res.send(status);
  };

  // Get class statistics
  const getClassStats = async (req, res) => {
    const { courseId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    const stats = await dao.getClassStats(courseId, currentUser._id);
    res.json(stats);
  };

  // Register routes
  app.get("/api/courses/:courseId/pazza/posts", findPostsForCourse);
  app.get("/api/pazza/posts/:postId", findPostById);
  app.post("/api/courses/:courseId/pazza/posts", createPost);
  app.put("/api/pazza/posts/:postId", updatePost);
  app.delete("/api/pazza/posts/:postId", deletePost);
  app.get("/api/courses/:courseId/pazza/stats", getClassStats);
}

