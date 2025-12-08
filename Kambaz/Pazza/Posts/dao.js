import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function PostsDao() {
  // Find all posts for a course (with optional filters)
  const findPostsForCourse = async (courseId, userId, userRole, folder = null, search = null) => {
    let query = { course: courseId };
    
    // Visibility filter: show posts visible to current user
    query.$or = [
      { postTo: "ENTIRE_CLASS" },
      { postTo: "INDIVIDUAL", visibleTo: userId }
    ];
    
    // Folder filter
    if (folder) {
      query.folders = folder;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { summary: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } }
      ];
    }
    
    return model.find(query).sort({ createdAt: -1 });
  };

  // Find a single post by ID
  const findPostById = (postId) => {
    return model.findById(postId);
  };

  // Create a new post
  const createPost = (post) => {
    const newPost = {
      ...post,
      _id: post._id || uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    };
    return model.create(newPost);
  };

  // Update a post
  const updatePost = (postId, postUpdates) => {
    return model.updateOne(
      { _id: postId },
      { $set: { ...postUpdates, updatedAt: new Date() } }
    );
  };

  // Delete a post
  const deletePost = (postId) => {
    return model.deleteOne({ _id: postId });
  };

  // Increment view count
  const incrementViews = (postId) => {
    return model.updateOne({ _id: postId }, { $inc: { views: 1 } });
  };

  // Get statistics for Class at a Glance
  const getClassStats = async (courseId, userId) => {
    const allPosts = await model.find({
      course: courseId,
      $or: [
        { postTo: "ENTIRE_CLASS" },
        { postTo: "INDIVIDUAL", visibleTo: userId }
      ]
    });
    
    return {
      totalPosts: allPosts.length,
      // Additional stats will be calculated with answers
    };
  };

  return {
    findPostsForCourse,
    findPostById,
    createPost,
    updatePost,
    deletePost,
    incrementViews,
    getClassStats,
  };
}

