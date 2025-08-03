# Auth Service API

A Node.js/Express.js authentication and user management API with JWT authentication, role-based access control, and MongoDB integration.

## Features
- User registration and login
- JWT-based authentication (access and refresh tokens)
- Role-based authorization (Admin, Editor, User)
- Secure password hashing with bcrypt
- CORS and credentials middleware
- MongoDB (via Mongoose)

## Getting Started

### Prerequisites
- Node.js >= 16
- MongoDB database (local or Atlas)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Byte-q/auth-service.git
   cd auth-service
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and set the following variables:
   ```env
   PORT=3500
   DATABASE_URL=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ORIGIN=http://localhost:3000
   ```

### Running the Server
```sh
npm run dev
```

## API Endpoints

All endpoints are prefixed with `/auth`.

| Method | Endpoint           | Description                | Auth Required | Roles         |
|--------|--------------------|----------------------------|---------------|---------------|
| POST   | /login             | User login                 | No            | -             |
| POST   | /register          | User registration          | No            | -             |
| GET    | /refresh           | Refresh access token       | No (cookie)   | -             |
| GET    | /logout            | Logout user                | No (cookie)   | -             |
| GET    | /                  | List all users             | No            | -             |
| GET    | /:id               | Get user by ID             | Yes           | Any           |
| GET    | /name/:name        | Get user by name           | Yes           | Any           |
| GET    | /email/:email      | Get user by email          | Yes           | Any           |
| PATCH  | /:id               | Update user                | Yes           | Admin, Editor |
| DELETE | /:id               | Delete user                | Yes           | Admin         |

### Example User Object
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "roles": { "User": 2001, "Admin": 5150 },
  "refreshToken": "...",
  "createdAt": "2025-08-03T12:00:00Z"
}
```

## Project Structure
```
controllers/    # Route handlers
models/         # Mongoose models
routes/         # API route definitions
middleware/     # Custom middleware (auth, roles, CORS)
config/         # Config files (CORS, roles, origins)
lib/            # Database connection
services/       # (Reserved for business logic)
```

## License
ISC

---
**Author:** Mohammed Abdalaziz
