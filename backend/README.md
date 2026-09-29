# LocalFarm Direct Backend API

Node.js, Express.js, MySQL, and Cloudinary backend server for **LocalFarm Direct**.

## Quick Links
- Detailed Architecture & API Specification: [`BACKEND_ARCHITECTURE.md`](file:///c:/Green-market/LocalFarm/backend/BACKEND_ARCHITECTURE.md)

## Environment Variables (.env)
Create a `.env` file in this directory with the following configuration:

```env
PORT=5000
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=localfarm_db
DB_PORT=3306

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_localfarm_2026
JWT_EXPIRES_IN=7d

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CLIENT_URL=http://localhost:5173
```

## Setup & Running
```bash
# 1. Install dependencies
npm install

# 2. Initialize and seed database
npm run db:init

# 3. Start development server
npm run dev
```
