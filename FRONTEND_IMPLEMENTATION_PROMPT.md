# Kambaz Quizzes - Frontend Implementation Guide

## 🎯 Overview
The backend for the Quizzes feature has been fully implemented with MongoDB integration. This document provides everything you need to implement the frontend.

---

## 📡 Backend API Endpoints

### Quiz Endpoints

#### 1. Get all quizzes for a course
```
GET /api/courses/:courseId/quizzes
Response: Array of Quiz objects
```

#### 2. Get a single quiz by ID
```
GET /api/quizzes/:quizId
Response: Quiz object with questions
```

#### 3. Create a new quiz
```
POST /api/courses/:courseId/quizzes
Body: { title, description, quizType, points, ... }
Response: Created Quiz object
```

#### 4. Update a quiz
```
PUT /api/quizzes/:quizId
Body: { title, description, points, ... }
Response: Update status
```

#### 5. Delete a quiz
```
DELETE /api/quizzes/:quizId
Response: Delete status
```

#### 6. Toggle publish/unpublish
```
PUT /api/quizzes/:quizId/publish
Response: Updated Quiz object with new published status
```

### Question Endpoints

#### 7. Add a question to a quiz
```
POST /api/quizzes/:quizId/questions
Body: { type, title, points, question, choices, correctAnswer, possibleAnswers }
Response: Created Question object
```

#### 8. Update a question
```
PUT /api/quizzes/:quizId/questions/:questionId
Body: { title, points, question, ... }
Response: Updated Question object
```

#### 9. Delete a question
```
DELETE /api/quizzes/:quizId/questions/:questionId
Response: Delete status
```

### Quiz Attempt Endpoints (for Students)

#### 10. Get all attempts for current user
```
GET /api/quizzes/:quizId/attempts
Response: Array of QuizAttempt objects
Requires: User session (authenticated)
```

#### 11. Get latest attempt for current user
```
GET /api/quizzes/:quizId/attempts/latest
Response: QuizAttempt object or null
Requires: User session (authenticated)
```

#### 12. Start a new attempt
```
POST /api/quizzes/:quizId/attempts
Response: New QuizAttempt object with attemptId
Requires: User session (authenticated)
```

#### 13. Submit an attempt with answers
```
PUT /api/attempts/:attemptId/submit
Body: { answers: [{ questionId, answer }, ...] }
Response: QuizAttempt object with calculated score
Requires: User session (authenticated)
```

#### 14. Get a specific attempt by ID
```
GET /api/attempts/:attemptId
Response: QuizAttempt object
```

---

## 📊 Data Models

### Quiz Object
```typescript
{
  _id: string;
  title: string;
  description?: string;
  course: string; // Course ID
  
  // Settings
  quizType: "GRADED_QUIZ" | "PRACTICE_QUIZ" | "GRADED_SURVEY" | "UNGRADED_SURVEY";
  points: number; // Sum of all question points
  assignmentGroup: "QUIZZES" | "EXAMS" | "ASSIGNMENTS" | "PROJECT";
  shuffleAnswers: boolean;
  timeLimit: number; // in minutes
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  
  // Dates
  dueDate?: Date;
  availableDate?: Date;
  untilDate?: Date;
  
  // Publishing
  published: boolean;
  
  // Questions (embedded)
  questions: Question[];
}
```

### Question Object
```typescript
{
  _id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
  title: string;
  points: number;
  question: string; // HTML from WYSIWYG
  
  // For Multiple Choice
  choices?: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  
  // For True/False
  correctAnswer?: boolean;
  
  // For Fill in the Blank
  possibleAnswers?: string[];
}
```

### QuizAttempt Object
```typescript
{
  _id: string;
  quiz: string; // Quiz ID
  user: string; // User ID
  attempt: number; // 1, 2, 3, etc.
  
  answers: Array<{
    questionId: string;
    answer: any; // string, boolean, or array
  }>;
  
  score: number;
  startedAt: Date;
  submittedAt?: Date;
}
```

---

## 🎨 Frontend Implementation Requirements

### 1. Quiz List Screen (`/courses/:courseId/quizzes`)

**Requirements:**
- Display list of quizzes for the current course
- Show "No quizzes yet. Click + Quiz to create one" if empty
- Each quiz shows:
  - Title (clickable → navigates to Quiz Details)
  - Availability status (Closed, Available, Not available until DATE)
  - Due date
  - Points
  - Number of questions
  - Published status (✅ green checkmark or 🚫 unpublished symbol)
  - For students: Show score from last attempt if exists
- Context menu (3 dots) with options:
  - Edit (faculty only)
  - Delete (faculty only)
  - Publish/Unpublish (faculty only)
- "+ Quiz" button (faculty only) creates new quiz and navigates to Quiz Editor
- Quizzes sorted by `availableDate` (ascending)

**API Calls:**
```javascript
// Get quizzes
const quizzes = await axios.get(`${API_URL}/api/courses/${courseId}/quizzes`);

// Create quiz
const newQuiz = await axios.post(`${API_URL}/api/courses/${courseId}/quizzes`, {
  title: "Unnamed Quiz"
});
// Then navigate to /courses/${courseId}/quizzes/${newQuiz._id}/edit

// Delete quiz
await axios.delete(`${API_URL}/api/quizzes/${quizId}`);

// Toggle publish
await axios.put(`${API_URL}/api/quizzes/${quizId}/publish`);
```

---

### 2. Quiz Details Screen (`/courses/:courseId/quizzes/:quizId`)

**For Faculty:**
- Display summary of all quiz properties
- "Preview" button → navigates to Quiz Preview
- "Edit" button → navigates to Quiz Editor

**For Students:**
- Display quiz info (title, description, points, due date, etc.)
- "Take Quiz" button → starts new attempt and navigates to Quiz Taking screen
- Show previous attempts with scores
- Disable "Take Quiz" if:
  - Quiz is not published
  - Current date is before availableDate or after untilDate
  - Student has exhausted attempts (if multipleAttempts is true)

**API Calls:**
```javascript
// Get quiz details
const quiz = await axios.get(`${API_URL}/api/quizzes/${quizId}`);

// Get student's attempts
const attempts = await axios.get(`${API_URL}/api/quizzes/${quizId}/attempts`);
```

---

### 3. Quiz Editor Screen (`/courses/:courseId/quizzes/:quizId/edit`)

**Two Tabs:**
1. **Details Tab** (default)
2. **Questions Tab**

#### Details Tab
**Form Fields:**
- Title (input text)
- Description (WYSIWYG editor or textarea)
- Quiz Type (dropdown): Graded Quiz, Practice Quiz, Graded Survey, Ungraded Survey
- Points (input number, read-only, calculated from questions)
- Assignment Group (dropdown): Quizzes, Exams, Assignments, Project
- Shuffle Answers (checkbox)
- Time Limit (checkbox + input number in minutes)
- Multiple Attempts (checkbox)
- How Many Attempts (input number, shown if Multiple Attempts is checked)
- Show Correct Answers (input text or dropdown)
- Access Code (input text)
- One Question at a Time (checkbox)
- Webcam Required (checkbox)
- Lock Questions After Answering (checkbox)
- Due Date (date picker)
- Available Date (date picker)
- Until Date (date picker)

**Buttons:**
- "Save" → saves and navigates to Quiz Details
- "Save & Publish" → saves, publishes, and navigates to Quiz List
- "Cancel" → doesn't save, navigates to Quiz List

**API Calls:**
```javascript
// Update quiz
await axios.put(`${API_URL}/api/quizzes/${quizId}`, {
  title,
  description,
  quizType,
  assignmentGroup,
  shuffleAnswers,
  timeLimit,
  multipleAttempts,
  howManyAttempts,
  showCorrectAnswers,
  accessCode,
  oneQuestionAtATime,
  webcamRequired,
  lockQuestionsAfterAnswering,
  dueDate,
  availableDate,
  untilDate,
});

// Save & Publish
await axios.put(`${API_URL}/api/quizzes/${quizId}`, { ...quizData });
await axios.put(`${API_URL}/api/quizzes/${quizId}/publish`);
```

#### Questions Tab
**Requirements:**
- Display list of questions
- "New Question" button adds question at bottom
- New questions shown in edit mode by default
- Each question shows:
  - Question type dropdown (Multiple Choice, True/False, Fill in the Blank)
  - Title (input text)
  - Points (input number)
  - Question text (WYSIWYG editor)
  - Type-specific fields (see below)
  - "Cancel" button (discards changes)
  - "Update Question" / "Save" button (saves question)
- Clicking "Edit" on existing question shows it in edit mode
- Calculate total points and update quiz

**Multiple Choice Question:**
- Question (WYSIWYG)
- Choices (list of textareas)
- Radio button to select correct choice
- "Add Another Answer" button
- Can remove choices

**True/False Question:**
- Question (WYSIWYG)
- Radio buttons for True/False
- Select correct answer

**Fill in the Blank Question:**
- Question (WYSIWYG)
- List of possible correct answers (input text)
- "Add Another Answer" button
- Can remove answers

**API Calls:**
```javascript
// Add question
const newQuestion = await axios.post(`${API_URL}/api/quizzes/${quizId}/questions`, {
  type: "MULTIPLE_CHOICE",
  title: "Question 1",
  points: 1,
  question: "What is 2 + 2?",
  choices: [
    { text: "3", isCorrect: false },
    { text: "4", isCorrect: true },
    { text: "5", isCorrect: false }
  ]
});

// Update question
await axios.put(`${API_URL}/api/quizzes/${quizId}/questions/${questionId}`, {
  title,
  points,
  question,
  choices, // or correctAnswer, or possibleAnswers
});

// Delete question
await axios.delete(`${API_URL}/api/quizzes/${quizId}/questions/${questionId}`);

// Update quiz points after question changes
const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
await axios.put(`${API_URL}/api/quizzes/${quizId}`, { points: totalPoints });
```

---

### 4. Quiz Preview Screen (`/courses/:courseId/quizzes/:quizId/preview`)

**For Faculty Only:**
- Display questions one at a time (if oneQuestionAtATime is true)
- Can navigate between questions
- Can answer questions
- "Submit Quiz" button calculates score (client-side, don't save to database)
- Show results: score, correct/incorrect answers highlighted
- "Edit Quiz" button → navigates to Quiz Editor

**Implementation:**
- Fetch quiz with questions
- Render questions based on type
- Calculate score locally (don't call API)
- Highlight correct (green) and incorrect (red) answers

---

### 5. Quiz Taking Screen (Students) (`/courses/:courseId/quizzes/:quizId/take`)

**Requirements:**
- Start new attempt when student clicks "Take Quiz"
- Display questions one at a time or all at once (based on oneQuestionAtATime)
- Can navigate between questions
- Save answers locally as student progresses
- "Submit Quiz" button submits answers to backend
- Backend calculates score automatically
- Navigate to Quiz Results screen after submission

**API Calls:**
```javascript
// Start attempt
const attempt = await axios.post(`${API_URL}/api/quizzes/${quizId}/attempts`);
const attemptId = attempt._id;

// Submit attempt
const result = await axios.put(`${API_URL}/api/attempts/${attemptId}/submit`, {
  answers: [
    { questionId: "q1-id", answer: "4" }, // Multiple choice: selected text
    { questionId: "q2-id", answer: true }, // True/False: boolean
    { questionId: "q3-id", answer: "two" }, // Fill in blank: string
  ]
});

// result contains: score, answers, submittedAt
```

---

### 6. Quiz Results Screen (Students) (`/courses/:courseId/quizzes/:quizId/attempts/:attemptId`)

**Requirements:**
- Display final score
- Show all questions with student's answers
- Highlight correct answers (green checkmark ✅)
- Highlight incorrect answers (red X ❌)
- Show correct answer for incorrect questions
- "Take Quiz Again" button (if attempts remaining)
- "Back to Quiz List" button

**API Calls:**
```javascript
// Get attempt details
const attempt = await axios.get(`${API_URL}/api/attempts/${attemptId}`);

// Get quiz to show correct answers
const quiz = await axios.get(`${API_URL}/api/quizzes/${quizId}`);

// Compare attempt.answers with quiz.questions to show correct/incorrect
```

---

## 🔐 Authentication & Authorization

### Role-Based Access Control

**Faculty Can:**
- Create, edit, delete quizzes
- Add, edit, delete questions
- Publish/unpublish quizzes
- Preview quizzes
- View all quizzes (published and unpublished)

**Students Can:**
- View published quizzes only
- Take quizzes (if published and within available dates)
- View their own attempts and scores
- Cannot edit or delete quizzes

### Implementation
```javascript
// Check user role
const currentUser = // get from session/context
const isFaculty = currentUser.role === "FACULTY";

// Conditional rendering
{isFaculty && (
  <button onClick={handleEdit}>Edit Quiz</button>
)}

// API calls should include credentials
axios.defaults.withCredentials = true;
```

---

## 📝 Important Notes

1. **Questions are embedded in Quiz documents** - When you fetch a quiz, questions come with it
2. **Automatic scoring** - Backend calculates score when student submits attempt
3. **Session required** - All attempt endpoints require authenticated user
4. **Points calculation** - Update quiz.points when questions change
5. **Date handling** - Use JavaScript Date objects, backend stores as ISO strings
6. **WYSIWYG editors** - Store HTML in question.question field
7. **Answer format**:
   - Multiple Choice: string (selected choice text)
   - True/False: boolean
   - Fill in Blank: string (case-insensitive comparison on backend)

---

## 🧪 Testing Checklist

### Faculty Tests:
- [ ] Create new quiz
- [ ] Edit quiz details
- [ ] Add multiple choice question
- [ ] Add true/false question
- [ ] Add fill in blank question
- [ ] Edit question
- [ ] Delete question
- [ ] Publish quiz
- [ ] Unpublish quiz
- [ ] Delete quiz
- [ ] Preview quiz

### Student Tests:
- [ ] View published quizzes
- [ ] Cannot see unpublished quizzes
- [ ] Take quiz (single attempt)
- [ ] View score and results
- [ ] Take quiz again (if multiple attempts enabled)
- [ ] Cannot take quiz if attempts exhausted
- [ ] Cannot take quiz if outside available dates

---

## 🚀 Deployment

**Backend is already deployed on Render:**
- URL: `https://kambaz-node-server-app-dli0.onrender.com`
- All quiz endpoints are live and tested
- MongoDB Atlas is configured and working

**Frontend needs:**
1. Set environment variable: `NEXT_PUBLIC_HTTP_SERVER=https://kambaz-node-server-app-dli0.onrender.com`
2. Deploy to Vercel
3. Test all functionality on production

---

## ✅ Backend Status

**Completed:**
- ✅ Quiz schema with all required fields
- ✅ Question schema (Multiple Choice, True/False, Fill in Blank)
- ✅ QuizAttempt schema for student answers
- ✅ Quiz DAO with CRUD operations
- ✅ QuizAttempt DAO with automatic scoring
- ✅ RESTful API routes
- ✅ MongoDB integration
- ✅ Session-based authentication
- ✅ Tested and working

**Ready for frontend implementation!** 🎉

