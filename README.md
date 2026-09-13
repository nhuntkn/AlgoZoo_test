# AlgoZoo

A class-based assignment and submission platform for students, trainers, and admins.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas / MongoDB
- Auth: JWT with HttpOnly cookies

## Project Structure

```bash
AlgoZoo/
├── client/                  # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/                  # Express backend
│   ├── src/
│   ├── package.json
│   └── .env
├── .gitignore
├── README.md
└── package-lock.json
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas or local MongoDB instance

## Environment Setup

Create a `.env` file inside the `server` folder:

```env
APP_NAME="AGLOZOO"
APP_PORT=3000
APP_BASE_URL="http://localhost:3000"
APP_SERVICE_URL="http://localhost:3000"

# DATABASE VARIABLES
MONGO_URI='mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority'

# JWT VARIABLES
JWT_SECRET_KEY='your-access-secret-key'
JWT_REFRESH_TOKEN_SECRET_KEY='your-refresh-secret-key'
JWT_ACCESS_TOKEN_EXPIRES='1d'
JWT_REFRESH_TOKEN_EXPIRES='5d'
JWT_TOKEN_COOKIE_EXPIRES=1000
```

Important:
- `MONGO_URI` must point to the actual database containing your users.
- JWT secret values must not be empty.
- Do not commit `.env` files to Git.

## Running the App

### 1) Start the backend

```bash
cd server
npm install
npm run dev
```

Backend runs at:

- `http://localhost:3000`

### 2) Start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

- `http://localhost:5173`

## API Routes

All backend routes are mounted under `/api`.

### Auth routes

- `POST /api/auth/login`
  - Body: `{ "email": "user@example.com", "password": "yourPassword" }`
  - Logs in and returns JWT cookies

- `POST /api/auth/register`
  - Body: `{ "token": "invite-token", "fullname": "Alice Nguyen", "email": "alice@example.com", "password": "secret123" }`
  - Registers a user from a class invite token

- `POST /api/auth/logout`
  - Requires authenticated user
  - Clears auth cookies

- `GET /api/auth/refresh-token`
  - Requires valid refresh token
  - Issues a new access token

### Admin routes

- `GET /api/admin/get-user`
- `GET /api/admin/get-user/:id`
- `GET /api/admin/users`

These are admin-protected routes.

### Class routes

- `POST /api/classes/:classId/generate-join-link`
  - Generates a join link for a class
  - Requires admin auth

## API Usage Examples

### Login

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

### Register

```bash
curl -i -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "token":"invite-token",
    "fullname":"Alice Nguyen",
    "email":"alice@example.com",
    "password":"secret123"
  }'
```

### Refresh token

```bash
curl -i -X GET http://localhost:3000/api/auth/refresh-token \
  --cookie "refreshToken=YOUR_REFRESH_TOKEN"
```

### Logout

```bash
curl -i -X POST http://localhost:3000/api/auth/logout \
  --cookie "accessToken=YOUR_ACCESS_TOKEN; refreshToken=YOUR_REFRESH_TOKEN"
```

## Auth Flow

This app uses JWTs in cookies:

- Access token: short lifetime, used for protected requests
- Refresh token: longer lifetime, used to renew access when expired

Typical flow:

1. User logs in
2. Server returns access + refresh tokens in cookies
3. Protected routes validate the access token
4. If access token expires, refresh endpoint is called
5. If refresh token is invalid or expired, user must log in again

## Troubleshooting

### User not found on login

- Check that the `email` exists exactly in MongoDB
- Confirm the correct database is used in `MONGO_URI`
- Make sure you are not searching the wrong database if multiple AlgoZoo databases exist

### Server-side error during login

- Check that `JWT_SECRET_KEY` and `JWT_REFRESH_TOKEN_SECRET_KEY` are not empty
- Confirm MongoDB is reachable
- Check backend terminal output for the exact stack trace

### CORS errors from frontend

- Add the frontend origin to the backend CORS config
- Usually this is `http://localhost:5173`

## Notes for Contributors

- Keep `.env` local and do not push it to Git
- Use the same auth conventions across frontend and backend
- If you change login/register payloads, update both frontend and backend together

## Build Check

To verify the frontend:

```bash
cd client
npm run build
```

To start the backend in dev mode:

```bash
cd server
npm run dev
```