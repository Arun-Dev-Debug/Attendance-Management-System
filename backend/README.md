# Attendance Management System - Backend

## Overview
NestJS backend with Prisma ORM, PostgreSQL database, and JWT authentication.

## Prerequisites
- Node.js v20.11.0+
- PostgreSQL database
- npm 10.2.4+

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/attendance_db?schema=public"
   JWT_SECRET="your-secret-key"
   JWT_EXPIRATION="1d"
   ```

3. **Setup database**
   ```bash
   # Push schema to database
   npx prisma db push
   
   # Generate Prisma Client
   npx prisma generate
   ```

## Running the Application

### Development
```bash
npm run start:dev
```
Server runs on `http://localhost:3000`

### Production
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Request Examples

**Register:**
```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

**Login:**
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Database Schema

- **User**: Email, password (hashed), name, role (ADMIN/TEACHER/STUDENT)
- **Course**: Name, code, description, teacher
- **Enrollment**: User-Course relationship
- **Session**: Course sessions with QR codes
- **Attendance**: Student attendance records

## Tech Stack
- NestJS
- Prisma ORM
- PostgreSQL
- Passport-JWT
- bcrypt
