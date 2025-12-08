import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function FoldersDao() {
  // Find all folders for a course
  const findFoldersForCourse = (courseId) => {
    return model.find({ course: courseId }).sort({ order: 1 });
  };

  // Initialize default folders for a course
  const initializeDefaultFolders = async (courseId) => {
    const defaultFolders = [
      "hw1", "hw2", "hw3", "hw4", "hw5", "hw6",
      "project", "exam", "logistics", "other", "office_hours"
    ];
    
    const folders = defaultFolders.map((name, index) => ({
      _id: uuidv4(),
      course: courseId,
      name,
      order: index,
      createdAt: new Date(),
    }));
    
    await model.insertMany(folders);
    return folders;
  };

  // Create a new folder
  const createFolder = async (courseId, folderName) => {
    const existingFolders = await model.find({ course: courseId });
    const newFolder = {
      _id: uuidv4(),
      course: courseId,
      name: folderName,
      order: existingFolders.length,
      createdAt: new Date(),
    };
    return model.create(newFolder);
  };

  // Update a folder
  const updateFolder = (folderId, folderUpdates) => {
    return model.updateOne({ _id: folderId }, { $set: folderUpdates });
  };

  // Delete a folder
  const deleteFolder = (folderId) => {
    return model.deleteOne({ _id: folderId });
  };

  // Delete multiple folders
  const deleteFolders = (folderIds) => {
    return model.deleteMany({ _id: { $in: folderIds } });
  };

  // Get folder by ID
  const findFolderById = (folderId) => {
    return model.findById(folderId);
  };

  return {
    findFoldersForCourse,
    initializeDefaultFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    deleteFolders,
    findFolderById,
  };
}

