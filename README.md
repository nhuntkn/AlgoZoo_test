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
APP_BASE_URL="http://localhost:5173"
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
- `APP_BASE_URL` should point to the frontend URL because invitation links open the frontend registration page.
- Registration uses a MongoDB transaction, so MongoDB must support transactions (replica set, Atlas, or `mongos`).
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

## Backend Integration Guide

The frontend is organized around the backend API contract. Backend routes and response shapes are the source of truth; frontend mock data should not be added when an API endpoint exists.

### Frontend layers

```text
client/src/
├── pages/       Route-level screens and user workflows
├── components/  Reusable visual components
├── services/    HTTP requests and backend response mapping
├── hooks/       Reusable React data-loading and state logic
├── types/       Shared TypeScript models and API response types
└── context/     Global state such as the authenticated user
```

Responsibilities:

- `types/` describes backend models and response contracts. Examples include `User`, `Class`, `ClassMember`, `Problem`, `ClassProblem`, `Submission`, and `File`.
- `services/` calls backend endpoints. Services use the shared API client, send cookies, unwrap response envelopes, and normalize backend field names for the UI.
- `hooks/` owns reusable loading/error state around services. For example, `useAuth`, `useAdminClasses`, `useAdminUsers`, `useClassDetail`, and `useProblems`.
- `context/` owns application-wide state. `AuthContext` stores the current user and delegates network requests to `authService`.
- `pages/` renders data from hooks/services. Pages should not contain duplicated `fetch` calls or hard-coded records.

### Adding a new backend feature

1. Confirm the route, middleware, HTTP method, request body, query parameters, and response envelope in `server/src/routes` and its controller.
2. Add or update the matching TypeScript model in `client/src/types`.
3. Add a function to the relevant service in `client/src/services` using the shared `api` client.
4. Normalize backend names such as `_id`, `fullname`, `class_id`, and `isActive` at the service boundary when the UI needs different names.
5. Add a hook when more than one page needs the same loading, error, or refresh behavior.
6. Replace page mock data with the hook/service result.
7. Add loading, empty, error, and success states to the page.
8. Run `npm run build` in `client` and syntax-check the affected backend files.

### Shared API clients

Use `client/src/services/api.ts` for the current backend-integrated feature pages. It:

- Uses `VITE_API_URL` or `VITE_API_BASE_URL`.
- Normalizes the URL so requests target `/api`.
- Sends cookies with `credentials: 'include'`.
- Supports `GET`, `POST`, `PATCH`, `DELETE`, and multipart upload requests.
- Converts non-2xx responses into `ApiError` objects.

Authentication uses `client/src/services/authService.ts` and `client/src/hooks/useAuth.ts`. Auth cookies are HttpOnly, so the browser must send them rather than JavaScript reading them directly.

### Current service coverage

| Service | Backend responsibility |
| --- | --- |
| `authService` | Login, registration, logout, current user, token refresh |
| `adminService` | Admin users, classes, dashboard, member removal, invitation links |
| `classroomService` | Trainer dashboards, classes, assigned class problems |
| `problemService` | Trainer/admin problem bank CRUD |
| `submissionService` | Trainer submission lists, details, and reviews |
| `studentService` | Student classes, dashboards, assigned problems, submissions |
| `fileService` | Authenticated file uploads for submission attachments |

## Backend API Coverage

All backend routes are mounted under `/api`.

### Auth routes

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/refresh-token`

Login and registration set `accessToken` and `refreshToken` HttpOnly cookies. Browser requests must use `credentials: 'include'`.

### Admin routes

- `GET /api/admin/dashboard?class_id=:id`
- `GET /api/admin/get-user`
- `GET /api/admin/get-user/:id`
- `GET /api/admin/users?role=student`
- `PATCH /api/admin/users/:user_id`
- `GET /api/admin/classes`
- `POST /api/admin/classes`
- `GET /api/admin/classes/:class_id`
- `PATCH /api/admin/classes/:class_id`
- `PATCH /api/admin/classes/:class_id/active`
- `DELETE /api/admin/classes/:class_id/student/:student_id`
- `DELETE /api/admin/classes/:class_id/trainer/:trainer_id`
- `POST /api/classes/:classId/generate-join-link`

Admin pages now use live class, user, member, dashboard, progress, and invitation data. Unsupported UI actions, such as class deletion when no delete route exists, should remain unavailable.

### Trainer routes

- `GET /api/trainer/dashboard`
- `GET /api/trainer/classes`
- `GET /api/trainer/classes/:class_id`
- `GET /api/trainer/classes/:class_id/problems?search=...`
- `POST /api/trainer/classes/:class_id/problems`
- `DELETE /api/trainer/classes/:class_id/problems/:problem_id`
- `GET /api/trainer/submissions`
- `GET /api/trainer/submissions/:submission_id`
- `PATCH /api/trainer/review/:submission_id`

Trainer pages use these endpoints for class lists, class detail, assignment management, review queues, submission details, and feedback. Trainer-only routes require the `trainer` role; class reads allow trainer/admin where defined by the backend middleware.

### Problem bank routes

- `GET /api/problems?search=...&difficulty=Easy`
- `POST /api/problems`
- `GET /api/problems/:problem_id`
- `PATCH /api/problems/:problem_id`
- `DELETE /api/problems/:problem_id`

Backend problem values are `OS`, `DB`, `DSA`, and `OTHER`. The UI maps `DB` to `Database` and `OTHER` to `Other` only at the service boundary.

### Student routes

- `GET /api/student/classes`
- `GET /api/student/classes/:classId/dashboard`
- `GET /api/student/classes/:classId/problems`
- `GET /api/student/problems/:classProblemId`
- `POST /api/student/submissions`

Student dashboard, class, problem-list, submission-list, submission-detail, and workspace pages use these endpoints. The student workspace submits the authenticated student account's work; it does not send `student_id` from the browser.

### File uploads

- `POST /api/files`

The request is authenticated `multipart/form-data` with a `file` field. Accepted types are PNG, JPG, JPEG, GIF, and PDF files up to 10 MB. The response returns a `file_id`, which can be included in a student submission content block.

For DSA submissions, the backend requires both:

1. A `code` or `text` content block.
2. An `image` or `file` content block.

The student workspace uploads the proof file first, then submits both blocks to `/api/student/submissions`.

## API Routes

All backend routes are mounted under `/api`.

### Auth routes

- `POST /api/auth/login`
  - Body: `{ "email": "user@example.com", "password": "yourPassword" }`
  - Logs in and returns JWT cookies

- `POST /api/auth/register`
  - Invite-only registration; requires a token generated by an admin
  - Body: `{ "token": "invite-token", "fullname": "Alice Nguyen", "email": "alice@example.com", "password": "secret123" }`
  - Creates the user, enrolls them in the invited class, and sets JWT cookies

- `POST /api/auth/logout`
  - Requires authenticated user
  - Clears auth cookies

- `GET /api/auth/refresh-token`
  - Requires valid refresh token
  - Issues a new access token

### Admin routes

- `GET /api/admin/get-user`
- `GET /api/admin/get-user/:id`
- `GET /api/admin/users?role=student`
- `PATCH /api/admin/users/:user_id`
  - Body: `{ "isActive": false }`
  - Activates or deactivates a user
- `POST /api/admin/classes`
  - Body: `{ "name": "WeCamp Batch 23", "description": "Optional description" }`
- `GET /api/admin/classes`
- `PATCH /api/admin/classes/:class_id`
  - Updates class name and description
- `PATCH /api/admin/classes/:class_id/active`
  - Body: `{ "isActive": false }`
  - Activates or deactivates a class and updates `archivedAt`

All admin routes require an authenticated user with the `admin` role.

### Class routes

- `POST /api/classes/:classId/generate-join-link`
  - Body: `{ "role": "student", "expiresInDays": 2 }`
  - Generates and stores a student or trainer invitation token
  - Requires admin authentication

### File routes

- `POST /api/files`
  - Requires authentication
  - Multipart form-data field: `file`
  - Accepts PNG, JPG, JPEG, GIF, and PDF files up to 10 MB


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

### Invitation registration flow

1. An admin creates a class from the admin dashboard.
2. The admin opens the class and generates a student or trainer invitation link.
3. The backend stores the role-specific token and expiration date on the class.
4. The admin sends the returned frontend URL to the invitee:
  `http://localhost:5173/register?token=INVITE_TOKEN&role=trainer`
5. A new user completes registration through the link. An existing trainer can use the link's `Log in and join instead` flow.
6. The backend validates the token, creates or finds the account, creates the `ClassMember` record, and sets authentication cookies.

The registration page is not a public sign-up page. Opening `/register` without a token shows an invitation-required message.

## Frontend Features

- Login and invite-only registration use the backend auth API.
- Unauthenticated users are redirected to `/login`.
- Admins can create classes, edit class name and description, toggle class status, generate student/trainer links, and view real users.
- Admins can activate or deactivate students from the Users page.
- Trainers can view their classes, assigned problems, submission queues, submission details, and review submissions.
- Students can view enrolled classes, live class progress, assigned problems, submit solutions, upload DSA proof files, and view feedback.
- Class, user, problem, submission, and progress data are loaded from MongoDB through the backend API; no demo records are used in the integrated flows.

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
- The default development origin is `http://localhost:5173`.
- Confirm the backend is running on `http://localhost:3000` and restart it after changing `.env`.

### Registration reports a duplicate username

- The current User model uses email rather than username.
- If MongoDB contains an old unique `username_1` index from a previous schema, remove that obsolete index before retrying registration.

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

The backend currently has no automated test suite; `npm test` is still a placeholder. Use the API examples above or Postman for manual integration testing.

To start the backend in dev mode:

```bash
cd server
npm run dev
```