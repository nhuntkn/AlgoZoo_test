# AlgoZoo
A lightweight platform for tracking assignment submissions and progress

## Tech Stack
 
- **Frontend:** React (via Vite)
- **Backend:** Node.js + Express
- **Database:** ⚠️ **Not yet decided** — see "Open Decisions" below
- **Language:** ⚠️ Currently configured in **JavaScript**. TypeScript vs JavaScript is not yet finalized as a team — see "Open Decisions" below
---
 
## ⚠️ Open Decisions (Not Yet Finalized)
 
These two things are still being discussed with the team. **Do not build major features on top of these assumptions until they're confirmed** — ask in the group chat if unsure.
 
1. **Database:** MongoDB, SQL (Postgres/MySQL), or SQLite — undecided
2. **Language:** JavaScript (current default) vs TypeScript — undecided
If you're picking this repo up and these are still unresolved, check with Thanh Thảo or the group chat before writing schema/model code, since switching later is much more work once things are built.
 
---
 
## Project Structure
 
```
AlgoZoo/
├── client/              # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   └── ...
│   └── package.json
├── server/              # Node/Express backend
│   ├── index.js
│   └── package.json
├── .gitignore
└── README.md
```
 
---
 
## Setup Instructions
 
### Prerequisites
- [Node.js](https://nodejs.org/) installed (LTS version recommended)
- Git installed
### 1. Clone the repo
```bash
git clone <repo-url>
cd AlgoZoo
```
 
### 2. Set up the frontend
```bash
cd client
npm install
npm run dev
```
This starts the React app, usually at `http://localhost:5173`.
 
### 3. Set up the backend
Open a **separate terminal**:
```bash
cd server
npm install
npm run dev
```
This starts the Express server at `http://localhost:5000`.
 
### 4. Verify it's working
With both running, open the frontend URL in your browser. You should see:
```
AlgoZoo
Backend status: ok
```
If it says "backend not reachable," double-check the server terminal is running and didn't crash.
 
---
 
## If We Switch to TypeScript
 
**This has not been decided yet.** If the team agrees to move to TypeScript, here's what needs to change:
 
### Backend (`server/`)
```bash
cd server
npm install typescript ts-node @types/node @types/express --save-dev
npx tsc --init
```
- Move `index.js` → `src/index.ts`
- Change `require(...)` syntax to `import ... from ...`
- Update `package.json` scripts:
```json
"scripts": {
  "dev": "ts-node src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```
 
### Frontend (`client/`)
Easiest path: re-scaffold with the TypeScript template and move existing code over:
```bash
npm create vite@latest client -- --template react-ts
```
- Rename `.jsx` files to `.tsx`
- Add type annotations as needed (e.g. `useState<string>('checking...')`)
### After switching
- Update this README's "Tech Stack" section to reflect the change
- Make sure everyone re-installs dependencies (`npm install`) after pulling the change
---
 
## Team Roles
 
| Area | Members |
|---|---|
| Backend & DB | Khải Yến, Thanh Trúc, Khánh Như |
| Frontend & Editor | Quỳnh Như, Thanh Thảo |
| UI/UX & Visualizer | Thảo Nhi, Bảo Hân |
 
---
 
## Environment Variables
 
Backend expects a `.env` file in `server/` (not committed to git). Once the DB is chosen, this will include the connection string. For now:
```
PORT=5000
```
 