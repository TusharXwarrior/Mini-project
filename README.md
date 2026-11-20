# EduRisk AI — Student Retention & Early Intervention System

EduRisk AI is a MERN application for managing student profiles, student–counsellor conversations and longitudinal academic progress checkpoints.

## Features
- Student profile CRUD and academic/attendance overview.
- Persistent conversation history with student and counsellor message views.
- Progress checkpoints: attendance, CGPA, assignment completion, backlogs and wellbeing.
- Latest-vs-previous checkpoint comparison: improving, stable or declining.
- Counsellor notes, action plans and follow-up dates.
- Optional AI-generated counselling drafts for human review; a guided template works without an AI key.
- Health endpoint and Render deployment blueprint.

## Stack
React, Vite, React Router, Tailwind, Axios, Node.js, Express, Mongoose and MongoDB.

## Local setup
Requirements: Node.js 18+ and MongoDB local or Atlas.

Backend:
```bash
cd backend
npm install
cp .env.example .env
# Set MONGODB_URI in backend/.env
npm run dev
```

Frontend (repository root, new terminal):
```bash
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173 and select **Conversations & Progress**. Frontend defaults to http://localhost:5000/api.

## API
- `GET /api/health`
- Existing CRUD: `/api/students`
- `GET /api/conversations` — overview for all students
- `GET /api/conversations/:studentId` — get/create a conversation
- `POST /api/conversations/:studentId/messages` — `{ "message": "...", "sender": "student|counsellor", "senderName": "..." }`
- `PATCH /api/conversations/:studentId/close`
- `GET /api/progress/:studentId`
- `POST /api/progress/:studentId` — required: attendance, cgpa, assignmentCompletion; optional: backlogs, wellbeing, notes, actionPlan, followUpAt, recordedBy.
- `POST /api/ai/counselling-suggestion/:studentId` — generates a draft suggestion.

## Optional AI assistant
Configure backend-only `AI_API_KEY`, optionally `AI_BASE_URL` and `AI_MODEL`. Without a key, the endpoint returns a rule-based guided check-in draft. AI text is a counsellor draft, not automatically delivered to students.

## Render deployment
1. Push this branch to GitHub and create a Render Blueprint using `render.yaml`.
2. Create MongoDB Atlas and set the backend `MONGODB_URI` environment variable.
3. Set backend `CLIENT_ORIGIN` to the exact deployed frontend origin.
4. Once Render creates the backend, replace `REPLACE-WITH-BACKEND.onrender.com` in the frontend service's `VITE_API_BASE_URL` with the real backend hostname plus `/api`, then redeploy the frontend.
5. Optionally set `AI_API_KEY` on the backend only. Never expose provider secrets in `VITE_*` variables.

## Production security — read before using real student data
This repository did not previously include an authentication system. The student/counsellor selector is a demo view switch, **not access control**. Do not deploy with identifiable student records until server-side authentication, role-based authorization, student-to-account ownership checks, HTTPS, rate limiting, audit logging, data-retention controls and privacy/consent notices are implemented. Restrict database network access and use a least-privilege MongoDB user.

Progress labels are transparent comparisons of entered checkpoints, not a validated dropout prediction. Human review is required; do not use them alone for disciplinary, clinical or high-impact decisions.
