# GoalSync Portal

GoalSync Portal is a simple full-stack internal employee goal-setting and quarterly tracking system built for hackathon demos. It focuses on end-to-end workflows, strict validation, role-based functionality, dashboards, reporting, and auditability without a fancy UI.

## Demo credentials

All seeded users use password `demo123`.

| Role | Email |
| --- | --- |
| Employee | `employee@demo.com` |
| Manager | `manager@demo.com` |
| Admin / HR | `admin@demo.com` |

A demo role switcher is visible in the sidebar after login. It switches between Employee, Manager, and Admin seeded accounts without logging out.

## Tech stack

- Frontend: React, React Router, Context API, Tailwind CSS, Recharts, SheetJS
- Backend: Node.js, Express.js, JWT auth, REST APIs
- Database: MongoDB with Mongoose models

## Setup

```bash
cp .env.example .env
npm install
npm run seed
npm run dev
```

Open `http://localhost:5173` and sign in with any demo account.

## Architecture diagram

```text
Browser (React + Tailwind + Router)
  |
  | JWT Bearer token REST calls
  v
Express API
  |-- auth + role middleware
  |-- goal workflow routes
  |-- quarterly update/check-in routes
  |-- reporting/admin/audit routes
  v
MongoDB
  |-- Users
  |-- Goals
  |-- SharedGoals
  |-- QuarterlyUpdates
  |-- CheckIns
  |-- Notifications
  |-- AuditLogs
  |-- Escalations
  |-- Cycles
```

## Core workflows

1. Employee creates draft goals with thrust area, title, description, UoM, target, score type, and weightage.
2. Frontend and backend enforce: total weightage exactly 100%, every goal at least 10%, and maximum 8 goals.
3. Employee submits the goal sheet.
4. Manager reviews team submissions, can inline edit target/weightage, approve, or reject with comments.
5. Approved goals are locked and cannot be edited by employees.
6. Admin can unlock goals, which writes an audit log.
7. Employees submit quarterly achievements when a cycle window is active.
8. Progress score is calculated and stored for MIN, MAX, TIMELINE, and ZERO score types.
9. Managers add timestamped structured check-in comments.
10. Admin and managers view reports, dashboards, escalations, and audit logs.

## API documentation

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Roles | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public | Login and receive JWT |
| POST | `/auth/switch-role` | Authenticated | Switch seeded demo role without re-login |
| GET | `/goals` | All | Role-scoped goal list |
| POST | `/goals/draft` | Employee | Create draft goal |
| PUT | `/goals/:id` | Employee/Manager | Employee draft edit or manager submitted-goal edit |
| POST | `/goals/submit` | Employee | Submit validated goal sheet |
| POST | `/goals/:id/approve` | Manager | Approve and lock goal |
| POST | `/goals/:id/reject` | Manager | Reject for rework with comments |
| POST | `/goals/:id/unlock` | Admin | Unlock approved goal and log audit trail |
| POST | `/goals/shared` | Manager/Admin | Create departmental shared goal assigned to employees |
| GET | `/updates` | All | Role-scoped quarterly updates |
| POST | `/updates` | Employee | Submit quarterly achievement |
| POST | `/updates/:goalId/checkins` | Manager | Add check-in comment |
| GET | `/admin/cycles` | All | View cycle windows |
| PATCH | `/admin/cycles/:id` | Admin | Activate/deactivate cycle windows |
| GET | `/admin/audit-logs` | Admin | View audit trail |
| GET | `/admin/escalations` | All | Role-scoped escalations |
| POST | `/admin/escalations/generate` | Admin | Generate simple escalation alerts |
| GET | `/reports` | Manager/Admin | JSON report rows |
| GET | `/reports/csv` | Manager/Admin | CSV export |

## Screenshots

A placeholder directory is included at `docs/screenshots/`. Run the app locally and capture screenshots from the dashboard, approvals, check-ins, reports, and audit logs during final demo prep.
