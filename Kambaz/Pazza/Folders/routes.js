import FoldersDao from "./dao.js";

export default function FolderRoutes(app) {
  const dao = FoldersDao();

  // Get all folders for a course
  const findFoldersForCourse = async (req, res) => {
    const { courseId } = req.params;
    let folders = await dao.findFoldersForCourse(courseId);
    
    // If no folders exist, initialize default folders
    if (folders.length === 0) {
      folders = await dao.initializeDefaultFolders(courseId);
    }
    
    res.json(folders);
  };

  // Create a new folder (instructor only)
  const createFolder = async (req, res) => {
    const { courseId } = req.params;
    const { name } = req.body;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    if (currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }
    
    const newFolder = await dao.createFolder(courseId, name);
    res.json(newFolder);
  };

  // Update a folder (instructor only)
  const updateFolder = async (req, res) => {
    const { folderId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    if (currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }
    
    const status = await dao.updateFolder(folderId, req.body);
    res.send(status);
  };

  // Delete a folder (instructor only)
  const deleteFolder = async (req, res) => {
    const { folderId } = req.params;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    if (currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }
    
    const status = await dao.deleteFolder(folderId);
    res.send(status);
  };

  // Delete multiple folders (instructor only)
  const deleteFolders = async (req, res) => {
    const { folderIds } = req.body;
    const currentUser = req.session["currentUser"];
    
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    
    if (currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }
    
    const status = await dao.deleteFolders(folderIds);
    res.send(status);
  };

  // Register routes
  app.get("/api/courses/:courseId/pazza/folders", findFoldersForCourse);
  app.post("/api/courses/:courseId/pazza/folders", createFolder);
  app.put("/api/pazza/folders/:folderId", updateFolder);
  app.delete("/api/pazza/folders/:folderId", deleteFolder);
  app.post("/api/pazza/folders/delete-multiple", deleteFolders);
}

