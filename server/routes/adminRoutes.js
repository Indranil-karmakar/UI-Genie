import express from 'express';
import User from '../models/UserSchema.js';
import GeneratedUI from '../models/GeneratedUISchema.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Get admin dashboard data
router.get('/dashboard', adminAuth, async (req, res) => {
    try {
        // Get total users
        const totalUsers = await User.countDocuments();
        
        // Get total generations
        const totalGenerations = await GeneratedUI.countDocuments();
        
        // Get active users (users who logged in within last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activeUsers = await User.countDocuments({
            lastLogin: { $gte: thirtyDaysAgo }
        });

        // Get all users
        const users = await User.find().sort({ createdAt: -1 });

        res.json({
            stats: {
                totalUsers,
                totalGenerations,
                activeUsers
            },
            users
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user
router.delete('/users/:userId', adminAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }

        // Delete user's generated UIs
        await GeneratedUI.deleteMany({ userId });

        // Delete user
        await User.findByIdAndDelete(userId);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 