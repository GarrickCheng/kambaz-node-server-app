import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function FollowupDiscussionsDao() {
  // Find all discussions for a post
  const findDiscussionsForPost = (postId) => {
    return model.find({ post: postId }).sort({ createdAt: 1 });
  };

  // Create a new discussion
  const createDiscussion = (discussion) => {
    const newDiscussion = {
      ...discussion,
      _id: discussion._id || uuidv4(),
      resolved: false,
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return model.create(newDiscussion);
  };

  // Update a discussion
  const updateDiscussion = (discussionId, discussionUpdates) => {
    return model.updateOne(
      { _id: discussionId },
      { $set: { ...discussionUpdates, updatedAt: new Date() } }
    );
  };

  // Toggle resolved status
  const toggleResolved = async (discussionId) => {
    const discussion = await model.findById(discussionId);
    discussion.resolved = !discussion.resolved;
    discussion.updatedAt = new Date();
    await discussion.save();
    return discussion;
  };

  // Delete a discussion
  const deleteDiscussion = (discussionId) => {
    return model.deleteOne({ _id: discussionId });
  };

  // Add a reply to a discussion
  const addReply = async (discussionId, reply) => {
    const newReply = {
      _id: uuidv4(),
      ...reply,
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await model.updateOne(
      { _id: discussionId },
      { $push: { replies: newReply } }
    );
    
    return newReply;
  };

  // Add a nested reply (reply to a reply)
  const addNestedReply = async (discussionId, parentReplyId, reply) => {
    const discussion = await model.findById(discussionId);
    
    // Helper function to find and add reply recursively
    const findAndAddReply = (replies, parentId, newReply) => {
      for (let r of replies) {
        if (r._id === parentId) {
          if (!r.replies) r.replies = [];
          r.replies.push(newReply);
          return true;
        }
        if (r.replies && r.replies.length > 0) {
          if (findAndAddReply(r.replies, parentId, newReply)) {
            return true;
          }
        }
      }
      return false;
    };
    
    const newReply = {
      _id: uuidv4(),
      ...reply,
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    findAndAddReply(discussion.replies, parentReplyId, newReply);
    discussion.updatedAt = new Date();
    await discussion.save();
    
    return newReply;
  };

  // Update a reply
  const updateReply = async (discussionId, replyId, replyUpdates) => {
    const discussion = await model.findById(discussionId);
    
    // Helper function to find and update reply recursively
    const findAndUpdateReply = (replies, targetId, updates) => {
      for (let r of replies) {
        if (r._id === targetId) {
          Object.assign(r, updates);
          r.updatedAt = new Date();
          return true;
        }
        if (r.replies && r.replies.length > 0) {
          if (findAndUpdateReply(r.replies, targetId, updates)) {
            return true;
          }
        }
      }
      return false;
    };
    
    findAndUpdateReply(discussion.replies, replyId, replyUpdates);
    discussion.updatedAt = new Date();
    await discussion.save();
    
    return discussion;
  };

  // Delete a reply
  const deleteReply = async (discussionId, replyId) => {
    const discussion = await model.findById(discussionId);
    
    // Helper function to find and delete reply recursively
    const findAndDeleteReply = (replies, targetId) => {
      for (let i = 0; i < replies.length; i++) {
        if (replies[i]._id === targetId) {
          replies.splice(i, 1);
          return true;
        }
        if (replies[i].replies && replies[i].replies.length > 0) {
          if (findAndDeleteReply(replies[i].replies, targetId)) {
            return true;
          }
        }
      }
      return false;
    };
    
    findAndDeleteReply(discussion.replies, replyId);
    discussion.updatedAt = new Date();
    await discussion.save();
    
    return discussion;
  };

  // Get discussion by ID
  const findDiscussionById = (discussionId) => {
    return model.findById(discussionId);
  };

  return {
    findDiscussionsForPost,
    createDiscussion,
    updateDiscussion,
    toggleResolved,
    deleteDiscussion,
    addReply,
    addNestedReply,
    updateReply,
    deleteReply,
    findDiscussionById,
  };
}

