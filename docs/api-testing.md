# API Testing Guide

## Automated Checks

Run these commands from the project root:

```bash
npm run test
npm run lint
npm run build
```

## Step-By-Step Manual API Tests

### 1. Start backend

```bash
npm run dev:server
```

Expected result:

- API starts on `http://localhost:5000`
- `GET /health` returns `{ "status": "ok" }`

### 2. Register a patient

- Method: `POST`
- URL: `http://localhost:5000/api/auth/register`
- Body:

```json
{
  "username": "patient_demo",
  "email": "patient_demo@test.com",
  "password": "password123",
  "role": "patient"
}
```

Expected result:

- Status `201`
- Response includes `token` and `role: "patient"`

### 3. Login as patient

- Method: `POST`
- URL: `http://localhost:5000/api/auth/login`
- Body:

```json
{
  "email": "patient_demo@test.com",
  "password": "password123",
  "role": "patient"
}
```

Expected result:

- Status `200`
- JWT token returned

### 4. Verify patient RBAC

- Method: `GET`
- URL: `http://localhost:5000/api/patient/me`
- Header: `Authorization: Bearer <token>`

Expected result:

- Status `200`

Now test forbidden access:

- Method: `GET`
- URL: `http://localhost:5000/api/provider/dashboard-analytics`
- Header: `Authorization: Bearer <token>`

Expected result:

- Status `403`

### 5. Create a mood entry

- Method: `POST`
- URL: `http://localhost:5000/api/entry`
- Header: `Authorization: Bearer <token>`
- Body:

```json
{
  "emotion": 7,
  "keywords": ["calm", "focus"],
  "category": "Work",
  "notes": "Felt productive after a short walk."
}
```

Expected result:

- Status `201`
- Created entry echoed back

### 6. Fetch dashboard analytics

- Method: `GET`
- URL: `http://localhost:5000/api/analytics/overview`
- Header: `Authorization: Bearer <token>`

Expected result:

- Status `200`
- Response contains `trends`, `categoryDistribution`, and `insights`

## Thunder Client / Postman Notes

- Import the endpoint list from [Swagger](./swagger.yaml)
- Save patient and psychologist tokens as environment variables
- Re-run `GET /api/provider/dashboard-analytics` with both roles to demonstrate RBAC
