const express = require('express');
const { query, validationResult } = require('express-validator');
const User = require('../models/User');
const CloudAdapter = require('../models/CloudAdapter');
const FileOperation = require('../models/FileOperation');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get user statistics (for current user)
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user data
    const user = await User.findById(userId);
    
    // Get adapter count
    const adapterCount = await CloudAdapter.countDocuments({ userId });
    
    // Get recent operations count
    const recentOperationsCount = await FileOperation.countDocuments({
      userId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    // Get operations by type
    const operationStats = await FileOperation.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$operation', count: { $sum: 1 } } }
    ]);

    // Get storage usage percentage
    const storagePercentage = user.storageLimit > 0 
      ? Math.round((user.storageUsed / user.storageLimit) * 100)
      : 0;

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subscription: user.subscription,
        storageUsed: user.storageUsed,
        storageLimit: user.storageLimit,
        storagePercentage,
        memberSince: user.createdAt
      },
      stats: {
        adapterCount,
        recentOperationsCount,
        operationStats: operationStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        totalOperations: operationStats.reduce((sum, stat) => sum + stat.count, 0)
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Server error fetching user statistics' });
  }
});

// Get all users (admin only)
router.get('/', [
  adminAuth,
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .isString()
    .trim()
    .withMessage('Search must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = search ? {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    // Get users
    const users = await User.find(searchQuery)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Get total count
    const totalCount = await User.countDocuments(searchQuery);

    res.json({
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + limit < totalCount
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// Get specific user (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user's adapters count
    const adapterCount = await CloudAdapter.countDocuments({ userId: user._id });
    
    // Get user's operations count
    const operationsCount = await FileOperation.countDocuments({ userId: user._id });

    res.json({
      user,
      stats: {
        adapterCount,
        operationsCount
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error fetching user' });
  }
});

// Update user (admin only)
router.put('/:id', [
  adminAuth,
  query('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
  query('subscription')
    .optional()
    .isIn(['free', 'premium', 'enterprise'])
    .withMessage('Subscription must be free, premium, or enterprise'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  query('storageLimit')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Storage limit must be a non-negative integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { role, subscription, isActive, storageLimit } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deactivating themselves
    if (req.user._id.toString() === user._id.toString() && isActive === false) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }

    // Update user
    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (subscription !== undefined) updateData.subscription = subscription;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (storageLimit !== undefined) updateData.storageLimit = storageLimit;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error updating user' });
  }
});

// Delete user (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Delete user's related data
    await CloudAdapter.deleteMany({ userId: user._id });
    await FileOperation.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({ message: 'User and related data deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error deleting user' });
  }
});

// Get system statistics (admin only)
router.get('/admin/system-stats', adminAuth, async (req, res) => {
  try {
    // Get user counts
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    // Get subscription counts
    const subscriptionStats = await User.aggregate([
      { $group: { _id: '$subscription', count: { $sum: 1 } } }
    ]);

    // Get adapter counts
    const totalAdapters = await CloudAdapter.countDocuments();
    const activeAdapters = await CloudAdapter.countDocuments({ isActive: true });

    // Get adapter type stats
    const adapterTypeStats = await CloudAdapter.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Get operation counts (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentOperations = await FileOperation.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get operation type stats (last 30 days)
    const operationTypeStats = await FileOperation.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$operation', count: { $sum: 1 } } }
    ]);

    // Get storage usage stats
    const storageStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalStorageUsed: { $sum: '$storageUsed' },
          totalStorageLimit: { $sum: '$storageLimit' },
          avgStorageUsed: { $avg: '$storageUsed' }
        }
      }
    ]);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        admins: adminUsers,
        subscriptions: subscriptionStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      },
      adapters: {
        total: totalAdapters,
        active: activeAdapters,
        byType: adapterTypeStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      },
      operations: {
        recentTotal: recentOperations,
        byType: operationTypeStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      },
      storage: storageStats[0] || {
        totalStorageUsed: 0,
        totalStorageLimit: 0,
        avgStorageUsed: 0
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({ error: 'Server error fetching system statistics' });
  }
});

module.exports = router;