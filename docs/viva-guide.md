# Viva Guide

## 1. One-Minute Project Introduction

MindFlow is a MERN-style mental health trend analytics platform. Patients can log mood entries and maintain private notes, while psychologists can monitor patient trends and view analytics. The backend is built with Express and MongoDB, authentication is handled using JWT, the frontend is built with React and Zustand, and the analytics dashboard is generated from aggregated mood-entry data.

## 2. How To Explain The Architecture

Use this order in the viva:

1. frontend
   React renders pages, handles navigation, and calls backend APIs through Axios.
2. auth state
   Zustand stores the logged-in user and JWT token and applies the token to future requests.
3. backend
   Express handles auth, entries, analytics, users, and personal-note routes.
4. middleware
   JWT middleware validates the user, and role middleware restricts provider-only routes.
5. database
   MongoDB stores users, mood entries, and private notes.
6. analytics
   Aggregation utilities calculate mood averages, keyword frequency, and category distribution.

## 3. File-By-File Code Walkthrough

### Frontend

- `client/src/App.jsx`
  Main routing configuration and lazy-loaded page setup.
- `client/src/store/useAuthStore.js`
  Login, register, logout, and token persistence logic.
- `client/src/pages/Dashboard.jsx`
  Fetches analytics and renders patient or doctor dashboard views.
- `client/src/pages/Reports.jsx`
  Displays report-related UI and entry data.
- `client/src/pages/PatientList.jsx`
  Provider-facing patient overview page.
- `client/src/pages/PatientDetail.jsx`
  Detailed patient information and record view.
- `client/src/pages/PersonalVault.jsx`
  Private-note management page.
- `client/src/pages/Emergency.jsx`
  Emergency support experience.

### Backend

- `server/server.js`
  Express setup, middleware registration, route mounting, health endpoint, and DB bootstrapping.
- `server/routes/auth.js`
  Registration and login logic.
- `server/routes/api.js`
  RBAC verification routes.
- `server/routes/analytics.js`
  Dashboard analytics endpoint.
- `server/routes/entry.js`
  Entry create/list/manual-entry flows.
- `server/routes/users.js`
  Patient management and profile/settings/password logic.
- `server/routes/personal.js`
  Personal-note APIs.
- `server/middleware/authMiddleware.js`
  JWT verification for protected requests.
- `server/middleware/requireRole.js`
  Role-based authorization.
- `server/utils/calculateTrends.js`
  Analytics aggregation logic.

## 4. Key Feature Explanations

### Authentication

- User submits login form from React.
- Backend validates credentials.
- JWT is generated and returned.
- Frontend stores the token in Zustand and local storage.
- Protected requests include `Authorization: Bearer <token>`.

### Role-Based Access Control

- Every protected route first checks JWT validity.
- `requireRole` verifies whether the current role is allowed.
- Example:
  patients can access `/api/patient/me`
  psychologists/admins can access `/api/provider/dashboard-analytics`

### Analytics Flow

- Mood entries are stored in MongoDB.
- `calculateDailyTrends` groups entries by date and calculates average mood.
- `calculateCategoryDistribution` groups entries by category.
- Backend returns trends, category distribution, and insight cards.
- Dashboard renders the results with charts and summary cards.

### Personal Vault

- Notes are stored with a user reference.
- Only the owner can fetch or delete their notes.
- This demonstrates both CRUD logic and ownership validation.

## 5. Likely Viva Questions And Answers

### Why did you choose MERN?

Because React is efficient for dynamic dashboards, Express makes REST APIs simple, MongoDB suits flexible healthcare-style documents, and Node keeps the stack consistent in JavaScript end to end.

### Why did you use JWT?

JWT supports stateless authentication, works well with REST APIs, and is easy to attach from the frontend in protected requests.

### Why did you use Zustand instead of Redux?

The project mainly needed lightweight auth and session state, so Zustand was enough and reduced boilerplate.

### How is security handled?

Security is handled using password hashing with bcrypt, JWT token verification, role-based authorization, request validation, Helmet for headers, and rate limiting.

### How are analytics calculated?

Mood entries are aggregated on the backend using MongoDB-style aggregation logic, then transformed into chart-ready data for the frontend.

### How did you test the project?

I added a repeatable backend verification script and validated health, auth, RBAC, and analytics utility logic. Frontend linting and production builds were also verified through `npm run verify`.

### What is one limitation of the current system?

The app is locally verified and deployment-ready, but a public cloud deployment still needs to be completed using a hosting account and secrets.

## 6. Recommended Demo Order During Viva

1. Show login page
2. Login as patient
3. Show patient dashboard and personal vault
4. Show reports or entry creation
5. Login as psychologist
6. Show patient list and patient detail
7. Explain analytics endpoint and dashboard rendering
8. Show Swagger or Postman docs
9. Show `npm run verify`

## 7. Commands To Mention In Viva

```bash
npm run dev
npm run test
npm run lint
npm run build
npm run verify
```

## 8. Future Scope Talking Points

- deploy to Vercel or Render
- add search and pagination
- add image upload support
- add frontend unit testing
- expose live Swagger UI
- integrate appointments and therapist notes
