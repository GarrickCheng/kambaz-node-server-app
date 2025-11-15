import "dotenv/config";
import express from 'express'
import session from "express-session";
import Hello from './Hello.js'
import Lab5 from './Lab5/index.js'
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import cors from "cors";

const app = express()
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL || "http://localhost:3000",
}));
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
Hello(app)
Lab5(app)
UserRoutes(app, db);
CourseRoutes(app, db);
ModuleRoutes(app, db);
app.listen(process.env.PORT || 4000)
