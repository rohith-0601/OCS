const express = require('express');
const router = express.Router();
const {
  createUser, getAllUsers, updateUser,
  resetUserPassword, deleteUser, getDashboardStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/reset-password', resetUserPassword);
router.delete('/users/:id', deleteUser);

module.exports = router;