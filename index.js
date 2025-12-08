import "dotenv/config";
import express from 'express'
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import Hello from './Hello.js'
import Lab5 from './Lab5/index.js'
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import QuizRoutes from "./Kambaz/Quizzes/routes.js";
import QuizAttemptRoutes from "./Kambaz/QuizAttempts/routes.js";
import cors from "cors";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz"
mongoose.connect(CONNECTION_STRING);
const app = express()
app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Allow all localhost ports during development
    if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
      return callback(null, true);
    }
    
    // Allow Vercel deployments
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow specific production URL
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
}));
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: CONNECTION_STRING,
    touchAfter: 24 * 3600, // lazy session update (24 hours)
  }),
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
Hello(app)
Lab5(app)
UserRoutes(app, db);
CourseRoutes(app, db);
ModuleRoutes(app, db);
AssignmentRoutes(app, db);
QuizRoutes(app);
QuizAttemptRoutes(app);
app.listen(process.env.PORT || 4000)
