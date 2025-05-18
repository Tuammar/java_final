# Booking System

A full-stack booking system application with JWT authentication.

## Project Structure

The project consists of two main parts:
1. **Backend**: Spring Boot application with JWT authentication
2. **Frontend**: React application with TypeScript

## Backend Features

- User registration and authentication with JWT
- Role-based authorization
- RESTful API endpoints
- PostgreSQL database integration
- Password encryption with BCrypt
- Validation for user input

## Frontend Features

- User registration and login forms
- Form validation with Formik and Yup
- JWT token storage and management
- Protected routes
- Material UI components
- Responsive design

## Getting Started

### Prerequisites

- Java 21
- Node.js and npm
- PostgreSQL database

### Database Setup

1. Create a PostgreSQL database named `bookingdb`
2. Run the SQL script in `schema.sql` to create the necessary tables

### Backend Setup

1. Navigate to the project root directory
2. Configure database connection in `src/main/resources/application.properties`
3. Build and run the Spring Boot application:

```bash
./gradlew bootRun
```

### Frontend Setup

1. Navigate to the `frontend` directory
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Access the application at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and get JWT token

## Technologies Used

### Backend
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- JWT Authentication
- PostgreSQL
- Lombok
- Gradle

### Frontend
- React 18
- TypeScript
- Material UI
- Formik & Yup
- Axios
- React Router 