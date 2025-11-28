# Attendance Management System - Frontend

## Overview
Angular frontend application with authentication and routing.

## Prerequisites
- Node.js v20.11.0+
- npm 10.2.4+
- Backend API running on `http://localhost:3000`

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Application

### Development
```bash
npm start
# OR
ng serve
```
Application runs on `http://localhost:4200`

### Production Build
```bash
ng build
```
Output in `dist/frontend`

## Features

### Pages
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **Dashboard** (`/dashboard`) - Protected landing page

### Authentication Flow
1. User registers with name, email, password, and role
2. User logs in with email and password
3. JWT token stored in localStorage
4. User can access dashboard
5. User can logout (clears token)

## Tech Stack
- Angular 19.x
- Angular Router
- Angular HttpClient
- FormsModule (Template-driven forms)

## Next Steps
- Add route guards for protected routes
- Implement error handling UI
- Add form validation
- Create role-specific dashboards
