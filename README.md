# Voosh Todo

## Overview

This project is for Voosh Assignment

## Features

### Frontend (React)
- User-friendly interface with Material-UI components.
- Responsive design for mobile and desktop views.
- Drag-and-drop task management for hospital tasks.
- Modal dialogs for editing and deleting tasks.
- Search and filter functionality for users and hospitals.

### Backend (Node.js)
- RESTful API built with Express.
- MongoDB for data storage with Mongoose for data modeling.
- User authentication with JWT (JSON Web Tokens).
- OTP-based registration process for users and hospitals.
- API documentation with Swagger.

## Tech Stack
- **Frontend**: React, Material-UI, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)
- bun

### Installation

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGO_URI=mongodb+srv://sudeep160403:1234@cluster0.aguzk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_jwt_secret
   NODE_ENV = development
   ```

4. Run the server:
   ```bash
   bun run dev
   ```
   The server should be running on `http://localhost:<PORT>`.

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd todo
   ```

2. Install dependencies:
   ```bash
   bun install
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```
    VITE_API_URL=http://localhost:5000/api
    VITE_GOOGLE_CLIENT_ID="781770008168-k1s20bef0aved50cr40jo36uv75dd1ss.apps.googleusercontent.com"
   ```
   
4. Start the frontend application:
   ```bash
   bun run dev
   ```
   The frontend should be running on `http://localhost:5173`.


## Usage

Once both the server and frontend are running, you can access the application in your web browser at `http://localhost:5173`. You can create, edit, and manage hospital tasks and users through the provided UI.
