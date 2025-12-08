import mongoose from "mongoose";
import schema from "./schema.js";

const model = mongoose.model("FollowupDiscussionModel", schema);
export default model;

