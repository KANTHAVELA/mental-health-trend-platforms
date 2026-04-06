# Architecture

## Stack Justification

- MERN is a strong fit here because React handles a dynamic dashboard UI well, Express keeps the API simple and testable, and MongoDB suits flexible patient, entry, and note documents.
- Zustand keeps frontend auth and session state lightweight without Redux boilerplate.
- Mongoose models map naturally to user, mood entry, and personal note entities.
- JWT is appropriate for stateless session handling across patient and psychologist roles.

## System Flow

```mermaid
flowchart LR
    U[Patient / Psychologist] --> C[React Client]
    C --> Z[Zustand Auth Store]
    C -->|HTTP / JSON| A[Express API]
    A --> M[Auth Middleware]
    M --> R[Route Controllers]
    R --> D[(MongoDB)]
    R --> T[Trend Utilities]
    T --> D
```

## Component Interaction Summary

1. The user signs in from the React client.
2. The backend validates credentials and returns a JWT.
3. Zustand stores the user session and attaches the token to Axios requests.
4. Protected Express routes validate the token and role.
5. Controllers read and write MongoDB documents using Mongoose.
6. Analytics utilities aggregate mood data for charts and insight cards.

## Request Lifecycle Example

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant Auth
    participant DB

    User->>Client: Submit login form
    Client->>API: POST /api/auth/login
    API->>DB: Find user
    DB-->>API: User document
    API->>Auth: Sign JWT
    API-->>Client: User profile + token
    Client->>API: GET /api/analytics/overview
    API->>Auth: Verify JWT
    API->>DB: Aggregate mood entries
    DB-->>API: Trend data
    API-->>Client: Insights + chart payload
```
