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