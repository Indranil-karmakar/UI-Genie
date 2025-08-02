# UI Genie - Authentication System

A responsive React application with user authentication, admin dashboard, and image-to-code generation functionality.

## Features

- 🔐 **User Authentication**: Login and signup with JWT tokens
- 👨‍💼 **Admin Dashboard**: User management and system statistics
- 🎨 **Responsive Design**: Modern UI that works on all devices
- 📱 **Image Upload**: Upload images to generate React code
- 🔒 **Protected Routes**: Secure access to different parts of the application
- 📊 **User Management**: Admin can view and manage users

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image uploads)
- Gemini API key (for code generation)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment variables:**
   Create a `.env` file in the server directory with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/ui-genie
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLOUDINARY_NAME=your-cloudinary-name
   CLOUDINARY_KEY=your-cloudinary-api-key
   CLOUDINARY_SECRET=your-cloudinary-api-secret
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system.

5. **Create admin user:**
   ```bash
   node setup-admin.js
   ```
   This will create an admin user with:
   - Email: admin@uigenie.com
   - Password: admin123

6. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Usage

### For Regular Users

1. **Sign up** with your email and password
2. **Login** to access the main dashboard
3. **Upload an image** to generate React code
4. **Download** the generated code

### For Admin Users

1. **Login** with admin credentials (admin@uigenie.com / admin123)
2. **Click "Admin"** button in the header to access admin dashboard
3. **View statistics** including total users, generations, and active users
4. **Manage users** by viewing user list and deleting users

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

## Deployment (Render)

### Environment Variables Required

When deploying to Render, you need to set the following environment variables in your Render dashboard:

1. **MONGO_URI**: Your MongoDB connection string
   ```
   mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database
   ```

2. **JWT_SECRET**: A secure random string for JWT token signing
   ```
   your-super-secret-jwt-key-change-this-in-production
   ```

3. **CLOUDINARY_NAME**: Your Cloudinary cloud name
   ```
   your-cloudinary-cloud-name
   ```

4. **CLOUDINARY_KEY**: Your Cloudinary API key
   ```
   your-cloudinary-api-key
   ```

5. **CLOUDINARY_SECRET**: Your Cloudinary API secret
   ```
   your-cloudinary-api-secret
   ```

6. **GEMINI_API_KEY**: Your Google Gemini API key
   ```
   your-gemini-api-key
   ```

### Render Deployment Steps

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set the build command: `npm run build`
4. Set the start command: `npm start`
5. Add all the environment variables listed above
6. Deploy!

### Troubleshooting 500 Errors

If you get a 500 error on `/api/upload`, follow these steps:

1. **Check the debug endpoint first:**
   ```
   GET https://your-app.onrender.com/api/upload/debug
   ```
   This will show you which environment variables are missing.

2. **Check Render logs:**
   - Go to your Render dashboard
   - Click on your service
   - Go to "Logs" tab
   - Look for error messages with ❌ emoji

3. **Common issues and solutions:**

   **Missing Environment Variables:**
   - Ensure all 6 environment variables are set in Render
   - Double-check spelling and values
   - Make sure there are no extra spaces

   **MongoDB Connection Issues:**
   - Verify your MongoDB URI is correct
   - Ensure your MongoDB cluster allows connections from Render's IPs
   - Check if your MongoDB cluster is active

   **Cloudinary Issues:**
   - Verify your Cloudinary credentials
   - Check if your Cloudinary account is active
   - Ensure you have sufficient upload quota

   **Gemini API Issues:**
   - Verify your Gemini API key is correct
   - Check if you have sufficient API quota
   - Ensure the API key has the correct permissions

4. **Test each service individually:**
   - Health check: `GET /api/health`
   - Upload debug: `GET /api/upload/debug`
   - Authentication: `POST /api/auth/login`

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:userId` - Delete user

### Upload
- `POST /api/upload` - Upload image and generate code (requires authentication)

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Admin.jsx
│   │   │   ├── Auth.css
│   │   │   └── Admin.css
│   │   ├── App.jsx         # Main app component
│   │   └── index.css       # Global styles
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB schemas
│   │   ├── UserSchema.js
│   │   └── GeneratedUISchema.js
│   ├── routes/             # API routes
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   └── uploadRoutes.js
│   ├── middleware/         # Authentication middleware
│   │   └── auth.js
│   ├── server.js           # Main server file
│   └── setup-admin.js      # Admin user creation script
└── README.md
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Protected Routes**: Role-based access control
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for security

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Technologies Used

### Frontend
- React 19
- React Router DOM
- CSS3 with animations
- Local Storage for token management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Cloudinary for image storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 