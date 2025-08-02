
import mongoose from 'mongoose';
import User from './models/UserSchema.js';
require('dotenv').config();

async function createAdminUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@uigenie.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@uigenie.com',
            password: 'admin123',
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@uigenie.com');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createAdminUser(); 