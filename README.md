# Finance Dashboard Backend API

Production-ready backend service for secure financial record management and analytics, built to demonstrate practical backend engineering skills expected in industry roles.

## Recruiter Snapshot

- Designed and implemented a role-based REST API using Node.js, Express, and MongoDB.
- Delivered secure authentication and authorization with JWT, bcrypt password hashing, and permission middleware.
- Implemented analytics endpoints (summary, category totals, monthly trends) using efficient MongoDB querying patterns.
- Added robust validation and standardized error handling to improve API reliability and developer experience.
- Built deployment-ready configuration and successfully deployed to Render.
- Validated behavior through automated API tests with a 14/14 passing run.

## What This Project Demonstrates

### Backend System Design

- Layered architecture with clear separation of concerns:
  - Routes for HTTP mapping
  - Controllers for request/response orchestration
  - Services for business logic
  - Models for persistence
  - Middleware for auth, validation, and error handling

### Security Engineering Practices

- JWT-based authentication flow with protected route middleware
- Role-based access control for Viewer, Analyst, and Admin roles
- Password hashing via bcryptjs
- Security headers via Helmet
- CORS control and request rate limiting
- Defensive validation with Zod on body and query inputs

### Data and API Quality

- Full CRUD support for financial records
- Filter and pagination support for scalable list endpoints
- Time-based and category-based analytics for dashboard use cases
- Consistent API response and error formats

## Core Features

- User registration, login, and profile retrieval
- Admin user management (view, update, delete)
- Financial records management with role-aware permissions
- Dashboard analytics:
  - Total income/expense summary
  - Category-wise totals
  - Monthly trend breakdown

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Token (JWT) |
| Validation | Zod |
| Security | bcryptjs, helmet, cors, express-rate-limit |
| Dev Tooling | nodemon |

## API Surface

Base URL:

```text
/api
```

Primary endpoint groups:

- Auth: `/auth/register`, `/auth/login`, `/auth/me`
- Users (Admin): `/users`, `/users/:id`
- Records: `/records`, `/records/:id`
- Dashboard: `/dashboard/summary`, `/dashboard/category-totals`, `/dashboard/monthly-trends`
- Health: `/health`

## Role Matrix

| Capability | Viewer | Analyst | Admin |
|---|---:|---:|---:|
| View records | Yes | Yes | Yes |
| Create records | No | Yes | Yes |
| Update records | No | No | Yes |
| Delete records | No | No | Yes |
| View dashboard | Yes | Yes | Yes |
| Manage users | No | No | Yes |

## Test Evidence

Automated suite executed with `npm run test:api`.

- Passed: 14
- Failed: 0
- Success Rate: 100%

Validated scenarios include:

- Health check
- Role-specific login flows
- Authorized and unauthorized record creation behavior
- Record retrieval with pagination
- Admin update/delete flows
- Dashboard endpoint responses
- Unauthorized access and invalid credential handling

## Deployment

- Deployed on Render
- Production configuration supports environment-based port and MongoDB URI
- Includes root and API route handling for deployment diagnostics and health checks

## Local Setup

### Prerequisites

- Node.js 14+
- npm
- MongoDB (Atlas or local)

### Install and run

```bash
npm install
npm run dev
```

### Environment variables

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_secret>
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
```

### Useful scripts

```bash
npm run start
npm run dev
npm run seed
npm run seed:atlas:reset
npm run test:api
npm run test:quick
```

## Project Structure

```text
server.js
src/
  app.js
  config/
  controllers/
  middleware/
  models/
  routes/
  services/
  utils/
scripts/
```

## This Backend System ensures : 

- Practical API security
- Maintainable code organization
- Correct authorization boundaries
- Deployability and production readiness
- Testing and issue resolution discipline


