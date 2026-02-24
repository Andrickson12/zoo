# Panda Zoo API

A REST API for managing pandas at a zoo. Zookeepers can register, login, and manage pandas. The public can view them.

---

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcrypt
- Zod Validation
- Helmet + Rate Limiting

---

## Getting Started

### 1. Clone the repo and install dependencies

```bash
npm install
```

### 2. Create a `.env` file

```env
PORT=3000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Run the server

```bash
npm run dev
```

---

## Auth Endpoints

### Register
`POST /api/v1/auth/register`

```json
{
  "name": "John",
  "email": "john@zoo.com",
  "password": "123456"
}
```

### Login
`POST /api/v1/auth/login`

```json
{
  "email": "john@zoo.com",
  "password": "123456"
}
```

Response:
```json
{
  "token": "eyJhbG...",
  "refreshToken": "eyJhbG..."
}
```

### Refresh Token
`POST /api/v1/auth/refresh`

```json
{
  "refreshToken": "eyJhbG..."
}
```

---

## Panda Endpoints

### Get all pandas (public)
`GET /api/v1/pandas`

Query params:
- `page` — page number (default: 1)
- `limit` — results per page (default: 10)
- `name` — filter by name

### Get one panda (public)
`GET /api/v1/pandas/:id`

### Get my pandas (protected)
`GET /api/v1/pandas/my`

### Add a panda (protected)
`POST /api/v1/pandas`

```json
{
  "name": "Mei",
  "age": 3,
  "weight": 85,
  "habitat": "Sichuan"
}
```

### Update a panda (protected)
`PUT /api/v1/pandas/:id`

```json
{
  "weight": 90
}
```

### Delete a panda (protected)
`DELETE /api/v1/pandas/:id`

---

## Authentication

Protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer your_token_here
```
