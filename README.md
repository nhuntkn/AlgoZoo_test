# AlgoZoo

AlgoZoo is a platform for managing algorithm classes, problems, assignments, submissions, and trainer feedback.

## Tech Stack

- **Frontend:** React, TypeScript, and Vite
- **Backend:** Node.js, Express, and JavaScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT access and refresh tokens
- **File uploads:** Multer, with files stored locally in `server/uploads/`

## Project Structure

```text
AlgoZoo/
├── client/              # React/Vite frontend
│   ├── src/
│   └── package.json
├── server/              # Express backend
│   ├── src/
│   │   ├── app/         # Express app and middleware
│   │   ├── config/      # Environment and database setup
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── uploads/         # Uploaded files, created automatically
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js LTS
- npm
- A MongoDB Atlas cluster or local MongoDB instance

## Setup

### Install dependencies

Open two terminals from the project root.

```powershell
cd server
npm install
```

```powershell
cd client
npm install
```

### Configure the backend


The MongoDB user must have access to the `algozoo` database. URL-encode special characters in the database password.

### Start the backend

```powershell
cd server
npm run dev
```

The backend runs at `http://localhost:3000`.

### Start the frontend

The backend CORS configuration allows the frontend on port `4200`:

```powershell
cd client
npm run dev -- --port 4200
```

Open `http://localhost:4200` in your browser.

## API Testing

### Login

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json
```

The current login endpoint expects `username`:

```json
{
  "username": "student",
  "password": "password123"
}
```

The response sets access and refresh tokens as cookies. For the upload request, copy the `accessToken` cookie into this header:

```text
Authorization: Bearer <access-token>
```

### Upload a file

```http
POST http://localhost:3000/api/files
Authorization: Bearer <access-token>
```

In Postman, choose **Body → form-data**, add a field named `file`, change its type to **File**, and select a file. Do not manually set `Content-Type`; Postman creates the multipart boundary automatically.

The upload limit is 10 MB. A successful response is similar to:

```json
{
  "file_id": "generated-mongodb-id",
  "filename": "example.pdf"
}
```

Uploaded files are stored in `server/uploads/`, and metadata is stored in MongoDB’s `files` collection.

### Other authentication routes

```text
POST /api/auth/logout
GET  /api/auth/refresh-token
```

### Common problems

- **`User does not exist`:** Confirm the username exists in the `users` collection in the database named in `MONGO_URI`.
- **`User password is incorrect`:** Passwords stored in MongoDB must be bcrypt hashes. Users created through Mongoose are hashed automatically.
- **`JWT access token is expired or invalid`:** Log in again and use the newly issued access token. Changing JWT secrets invalidates older tokens.
- **`No file uploaded`:** Use `multipart/form-data`, name the field `file`, and select an actual file.
- **`querySrv ECONNREFUSED`:** Node cannot resolve the MongoDB Atlas SRV record. Check DNS, VPN, firewall, or network settings.
 