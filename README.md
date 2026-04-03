# Talent IQ

Talent IQ is a full-stack coding interview and practice platform built for technical screening, pair programming, and solo problem solving. It combines a Monaco-based code editor, authenticated interview rooms, real-time video and chat, and remote code execution in a single workflow.

![Talent IQ screenshot](/frontend/public/screenshot-for-readme.png)

## What the project does

Talent IQ supports two main use cases:

- Live interview sessions where two users can join the same room, discuss over video, chat in real time, and run code against a selected problem.
- Solo practice mode where a signed-in user can solve curated problems, switch languages, and run code with instant feedback.

## Features

- Clerk authentication for protected access to the app.
- Dashboard for creating interview sessions and viewing active and recent sessions.
- One-click session creation with a selected problem and difficulty.
- Session locking so only two participants can be in a room at once.
- Stream Video powered interview rooms with built-in call controls.
- Stream Chat inside the interview session for live messaging.
- Monaco code editor with support for JavaScript, Python, and Java.
- Resizable coding layout for problem description, editor, output, and video/chat.
- Practice problems page with curated coding questions and difficulty labels.
- Remote code execution through a Piston-compatible API.
- Test-style output validation in practice mode with success and failure toasts.
- Confetti celebration when all expected outputs match in practice mode.
- Recent completed sessions and active session browsing from the dashboard.
- MongoDB persistence for users and interview sessions.
- Inngest background functions for syncing Clerk users into MongoDB and Stream.

## Product flow

### 1. Sign in

Users sign in with Clerk. Protected routes include:

- `/dashboard`
- `/problems`
- `/problem/:id`
- `/session/:id`

### 2. Practice alone

From the Problems page, a user can:

- Open any curated problem.
- Read the description, examples, and constraints.
- Choose JavaScript, Python, or Java.
- Edit starter code in the Monaco editor.
- Run code and inspect output.
- Get pass/fail feedback based on expected outputs.

### 3. Run a live interview session

From the Dashboard, a user can:

- Create a new session by selecting a problem.
- Enter the session as the host.
- Let another signed-in user join the same room.
- Collaborate through video, chat, and shared problem context.
- Run code inside the session.
- End the session as the host when finished.

## Tech stack

### Frontend

- React 19
- Vite
- React Router
- Clerk
- TanStack Query
- Monaco Editor
- Stream Video React SDK
- Stream Chat React
- Tailwind CSS + daisyUI

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Clerk Express
- Stream Chat + Stream Video server SDK
- Inngest

### External services

- Clerk for authentication
- Stream for video and chat
- MongoDB for persistence
- Piston-compatible API for code execution
- Inngest for async event-driven user sync

## Repository structure

```text
talent-IQ/
|-- backend/
|   |-- src/
|   |   |-- controllers/
|   |   |-- lib/
|   |   |-- middleware/
|   |   |-- models/
|   |   `-- routes/
|-- frontend/
|   |-- public/
|   `-- src/
|       |-- api/
|       |-- components/
|       |-- data/
|       |-- hooks/
|       |-- lib/
|       `-- pages/
|-- package.json
`-- README.md
```

## Environment variables

Create `.env` files in both `backend` and `frontend`.

### Backend: `backend/.env`

```bash
PORT=3000
NODE_ENV=development

DB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
PISTON_API_URL=http://localhost:2000/api/v2/piston

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### Frontend: `frontend/.env`

```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=your_stream_api_key
```

## Setup and run locally

### 1. Install dependencies

From the project root:

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 2. Start the backend

```bash
cd backend
npm run dev
```

The backend runs on `http://localhost:3000`.

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on `http://localhost:5173`.

## How to use the app

### Dashboard

- Sign in and open `/dashboard`.
- Create a new interview session from the modal.
- Review currently active sessions.
- Revisit recently completed sessions from the recent sessions section.

### Practice problems

- Open `/problems`.
- Choose a problem from the list.
- Switch language if needed.
- Write or update the starter code.
- Click run to execute the solution.
- Check the output panel for runtime output or errors.

### Interview sessions

- Create a session from the dashboard.
- Share the session URL with another signed-in user.
- The second user joins automatically when opening the session page, as long as the room is still active and not full.
- Use the right panel for video and in-session chat.
- Use the left panel for reading the prompt, writing code, and checking output.
- The host can end the session, which closes the room and marks it completed.

## API overview

Protected backend routes:

- `GET /health`
- `POST /api/execute`
- `GET /api/chat/token`
- `POST /api/sessions`
- `GET /api/sessions/active`
- `GET /api/sessions/my-recent`
- `GET /api/sessions/:id`
- `POST /api/sessions/:id/join`
- `POST /api/sessions/:id/end`

Inngest handler:

- `POST /api/inngest`

## Notes

- Session participation is limited to two users: one host and one participant.
- Practice mode currently includes curated in-app problems and expected outputs for JavaScript, Python, and Java.
- Code execution depends on a reachable Piston-compatible API.
- The public `emkc.org` Piston endpoint is allowlist-only, so local development should use your own Piston instance via `PISTON_API_URL`.
- Video and chat depend on valid Stream credentials.
- Authentication-protected routes depend on valid Clerk configuration.

## Build for production

From the root:

```bash
npm run build
npm start
```

The root build script installs backend and frontend dependencies, builds the frontend, and serves the frontend from the Express backend in production mode.
