# MindFlow Project Report

## 1. Abstract

MindFlow is a full-stack mental health trend analytics platform designed for patients and mental health professionals. The application allows patients to log emotional states, maintain private notes, and review simple trend insights, while psychologists can review patient records, monitor activity, and interpret aggregate wellness patterns. The system uses a MERN-style architecture with React on the frontend, Express and Node.js on the backend, and MongoDB as the primary database. JWT-based authentication, role-based access control, analytics aggregation, and dashboard visualizations are used to create a secure and interactive system.

## 2. Problem Statement

Many wellness applications either stop at simple journaling or only address clinical record keeping. They do not connect patient self-tracking with usable trend analytics for both personal reflection and provider review. This creates a gap between emotional data collection and practical decision support.

MindFlow solves this by:

- allowing patients to record structured mood data
- helping psychologists review patient trends and recent activity
- protecting data through authentication and authorization
- turning raw entries into readable charts and dashboard insights

## 3. Objectives

- Build a secure full-stack application for mood and wellness tracking
- Support separate patient and psychologist workflows
- Implement RESTful APIs for authentication, entries, analytics, users, and private notes
- Visualize emotional patterns through trend analytics
- Improve usability with responsive UI, loaders, and toast notifications
- Prepare evaluation-ready documentation, testing evidence, and viva explanation material

## 4. Scope Of The System

### Included Scope

- user registration and login
- JWT-based protected routes
- role-based access control for patient and psychologist views
- mood entry creation and retrieval
- personal note management
- patient management for providers
- trend aggregation and dashboard insights
- responsive frontend dashboards and support tools

### Excluded Scope

- real-time counseling chat integration
- public production secrets management
- hospital EMR integration
- ML-based medical diagnosis

## 5. Technology Stack And Justification

### Frontend

- React
  Chosen for reusable components and dynamic dashboard rendering.
- Vite
  Used for faster local development and optimized production output.
- Tailwind CSS
  Provides consistent styling and responsive layouts.
- Zustand
  Lightweight state management for auth/session state without Redux overhead.
- Recharts and React Flow
  Used for charts and graph-based data presentation.

### Backend

- Node.js and Express
  Suitable for REST API development and middleware-based request processing.
- Mongoose
  Maps application objects to MongoDB collections using schemas.
- JWT
  Enables stateless authentication between client and server.
- bcryptjs
  Protects stored passwords through hashing.
- Helmet and express-rate-limit
  Add baseline security controls.

### Database

- MongoDB
  Suitable for flexible user, note, and mood-entry documents.

## 6. Architecture Summary

The system follows a client-server architecture:

1. React collects user input and renders pages.
2. Axios sends requests to the Express backend.
3. Auth middleware verifies JWTs.
4. Role middleware restricts access based on patient or psychologist roles.
5. Mongoose reads and writes MongoDB documents.
6. Analytics utilities aggregate mood entries for charts and summary cards.

Reference:

- [architecture.md](./architecture.md)

## 7. Database Design Summary

The core entities are:

- `User`
- `MoodEntry`
- `PersonalNote`

### User

Stores account information, role, demographic data, contact details, settings, and mental health metadata.

### MoodEntry

Stores emotion score, category, keywords, notes, timestamp, and reference to the user.

### PersonalNote

Stores user-owned private notes with title, content, category, and timestamps.

Reference:

- [db-schema.md](./db-schema.md)

## 8. Module-Wise Implementation

### 8.1 Authentication Module

Implemented in:

- `server/routes/auth.js`
- `server/middleware/authMiddleware.js`
- `server/middleware/requireAuth.js`
- `client/src/store/useAuthStore.js`

Features:

- register users with hashed passwords
- login with email, password, and role
- generate JWT tokens
- attach JWT to protected frontend requests
- support demo-mode fallback when MongoDB is unavailable

### 8.2 Role-Based Access Control

Implemented in:

- `server/middleware/requireRole.js`
- `server/routes/api.js`
- `server/routes/users.js`
- `server/routes/entry.js`

Features:

- patient-only route protection
- psychologist/admin-only provider analytics
- provider-only patient creation and patient detail access
- provider-only manual mood entry creation

### 8.3 Mood Entry Module

Implemented in:

- `server/routes/entry.js`
- `server/models/MoodEntry.js`
- `client/src/pages/Reports.jsx`
- `client/src/components/ManualEntryModal.jsx`

Features:

- create mood entries
- fetch recent entries
- provider-assisted manual entry creation
- input validation for emotion, category, timestamp, and user references

### 8.4 Analytics Module

Implemented in:

- `server/routes/analytics.js`
- `server/utils/calculateTrends.js`
- `client/src/pages/Dashboard.jsx`

Features:

- aggregate daily mood averages
- compute keyword frequency
- compute category distribution
- generate chart-ready dashboard insight data

### 8.5 Personal Vault Module

Implemented in:

- `server/routes/personal.js`
- `server/models/PersonalNote.js`
- `client/src/pages/PersonalVault.jsx`

Features:

- fetch personal notes
- create private notes
- delete notes with ownership checks

### 8.6 Patient Management Module

Implemented in:

- `server/routes/users.js`
- `server/models/User.js`
- `client/src/pages/PatientList.jsx`
- `client/src/pages/PatientDetail.jsx`

Features:

- fetch all users for psychologist view
- create patient profiles
- access detailed patient records
- update profile, password, and settings

### 8.7 UI Support Modules

Implemented in:

- `client/src/pages/Emergency.jsx`
- `client/src/pages/Games.jsx`
- `client/src/components/Layout.jsx`
- `client/src/components/Sidebar.jsx`

Features:

- emergency support page
- mindful activities and breathing exercise
- responsive layout and navigation
- toast feedback and loading states

## 9. API Summary

The application exposes these major API groups:

- health
- authentication
- RBAC verification routes
- analytics
- mood entry flows
- user/profile management
- personal notes

Reference:

- [swagger.yaml](./swagger.yaml)
- [postman_collection.json](./postman_collection.json)
- [api-testing.md](./api-testing.md)

## 10. Security Measures

Security is handled through:

- JWT-based authentication
- bcrypt password hashing
- role-based authorization middleware
- server-side validation helpers
- Helmet for HTTP header protection
- rate limiting
- ownership checks before deleting private notes

## 11. State Management Strategy

Frontend state management uses Zustand through `useAuthStore`.

Reasons:

- minimal boilerplate
- suitable for login/logout and persisted session state
- easy token persistence in local storage
- enough for the current application size

## 12. UI/UX Summary

The frontend is designed to feel calm, modern, and supportive.

Key characteristics:

- dashboard-first layout
- card-based information grouping
- soft gradients and rounded containers
- mobile-friendly responsive arrangement
- animated skeleton loaders
- toast notifications for user feedback

Reference:

- [wireframes.md](./wireframes.md)

## 13. Testing And Validation

### Automated Validation

The following command was added and verified:

```bash
npm run verify
```

This executes:

- backend tests
- frontend lint
- frontend production build

### Backend Test Coverage

Implemented in:

- `server/tests/run-tests.js`

Validated flows:

- health endpoint response
- invalid auth payload rejection
- registration flow
- login flow
- RBAC enforcement
- trend utility calculations

### Manual Validation Areas

- dashboard loading
- patient login flow
- psychologist patient management flow
- personal vault actions
- analytics visualization rendering

## 14. Performance Improvements

Implemented improvements:

- route-level lazy loading in the React app
- manual chunk splitting in Vite for large dependencies
- limited result set for recent entries
- MongoDB aggregation pipelines for analytics calculations

## 15. Build And Deployment Readiness

The project includes:

- root verification scripts
- workspace package scripts
- environment example file
- GitHub Actions CI workflow
- documentation for setup and testing

Current external step still required:

- deploy to Vercel, Render, or AWS and attach the live URL

## 16. Challenges Faced

- coordinating nested workspace scripts
- frontend build failures in restricted environments due to `esbuild` process spawning
- keeping JWT fallback handling consistent across auth and middleware
- expanding documentation from minimal to evaluator-ready quality

## 17. Final Hardening Improvements

- fixed frontend routing structure
- cleaned lint issues
- added route-level lazy loading
- improved chunk splitting for production build
- added validation helpers
- improved RBAC route protections
- added comprehensive docs and testing assets

## 18. Future Enhancements

- deploy live with environment-managed secrets
- add search and pagination
- add image upload support
- add frontend unit testing
- expose live Swagger UI
- integrate appointments and therapist notes

## 19. Conclusion

MindFlow demonstrates a complete full-stack mental health analytics platform with secure authentication, role-based workflows, analytics generation, and a polished frontend experience. The project is now academically presentable for documentation and viva review, with live deployment remaining as the only external hosting step.
