# Finance Dashboard Backend API

A Node.js and Express backend for managing financial records with JWT authentication, role-based access control, validation, and dashboard analytics.

## Overview

This project provides a secure backend API for a finance dashboard. It supports user authentication, role-aware record management, and summary analytics for income and expense tracking.

## Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based authorization for Viewer, Analyst, and Admin users
- Financial record CRUD operations
- Filtering and pagination for record queries
- Dashboard summary, category totals, and monthly trends
- Zod validation for request payloads and query parameters
- Helmet, CORS, and rate limiting for basic API hardening

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT |
| Validation | Zod |
| Security | bcryptjs, helmet, cors, express-rate-limit |

## Project Scripts

| Script | Description |
|---|---|
| `npm run start` | Start the server in production mode |
| `npm run dev` | Start the server with nodemon |
| `npm run seed` | Seed MongoDB with demo users and financial data |
| `npm run seed:atlas:reset` | Reset the Atlas dataset and reseed it |
| `npm run test:api` | Run the full API test suite |
| `npm run test:quick` | Run the quick smoke test |

## Installation

### Prerequisites

- Node.js 14+
- npm
- MongoDB Atlas or a local MongoDB instance

### Setup

```bash
git clone <repository-url>
cd finance-backend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/finance-dashboard
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
```

## Running the App

```bash
npm run dev
```

For production:

```bash
npm start
```

To seed the database:

```bash
npm run seed
```

## API Base URL

```text
http://localhost:3000/api
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Log in and receive a JWT
- `GET /auth/me` - Get the currently authenticated user

### Users

- `GET /users` - Get all users, admin only
- `GET /users/:id` - Get a user by ID, admin only
- `PATCH /users/:id` - Update a user, admin only
- `DELETE /users/:id` - Delete a user, admin only

### Financial Records

- `POST /records` - Create a record, analyst/admin only
- `GET /records` - Get records with filters and pagination
- `GET /records/:id` - Get a single record
- `PATCH /records/:id` - Update a record, admin only
- `DELETE /records/:id` - Delete a record, admin only

### Dashboard

- `GET /dashboard/summary` - Get income/expense summary
- `GET /dashboard/category-totals` - Get category-wise totals
- `GET /dashboard/monthly-trends` - Get monthly trend data

## Role-Based Permissions

| Action | Viewer | Analyst | Admin |
|---|---:|---:|---:|
| View records | Yes | Yes | Yes |
| Create records | No | Yes | Yes |
| Update records | No | No | Yes |
| Delete records | No | No | Yes |
| View dashboard | Yes | Yes | Yes |
| Manage users | No | No | Yes |

## Validation Notes

- Request bodies are validated with Zod before controller logic runs.
- Query parameters for record listing are coerced so values like `page=1` and `limit=5` work correctly.
- Date filters are accepted as query strings and converted before being used in database queries.

## Testing

### Verified API Test Run

The full API suite was run with `npm run test:api` and passed successfully.

**Summary**

- Passed: 14
- Failed: 0
- Success Rate: 100%

**Passed Test Cases**

- Health Check
- Admin Login
- Analyst Login
- Viewer Login
- Admin Creates Record
- Viewer Cannot Create
- Get Records
- Admin Updates Record
- Dashboard Summary
- Category Totals
- Monthly Trends
- Invalid Login
- No Token
- Admin Deletes Record

### Quick Smoke Test

You can also run the lightweight smoke test:

```bash
npm run test:quick
```

## Error Handling

The API returns standard HTTP status codes for common outcomes:

- `200` Success
- `201` Created
- `204` No Content
- `400` Validation error
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `500` Internal Server Error

## Project Structure

```text
├── server.js
├── src/
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
└── scripts/
    ├── seedAtlas.js
    ├── testApiWorking.js
    ├── testApiWithFetch.js
    ├── quickTestWithFetch.js
    └── runTests.bat
```

## Notes

- The seed script uses the same credentials documented in the test suite.
- The application expects MongoDB to be reachable before running the API tests.
- If `npm run test:api` fails with a 400 on record listing, verify the query validation schema and ensure the server is running on port 3000.

## License

MIT
