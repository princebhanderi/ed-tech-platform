const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middlewares/auth');
const { listAllUsers, listAllCourses, deleteCourseById, getPlatformStats, deleteUserById, listAllCategories, createCategory, deleteCategoryById } = require('../controllers/Admin');

router.get('/users', auth, isAdmin, listAllUsers);
router.get('/courses', auth, isAdmin, listAllCourses);
router.delete('/course/:id', auth, isAdmin, deleteCourseById);
router.get('/stats', auth, isAdmin, getPlatformStats);
router.delete('/user/:id', auth, isAdmin, deleteUserById);
router.get('/categories', auth, isAdmin, listAllCategories);
router.post('/category', auth, isAdmin, createCategory);
router.delete('/category/:id', auth, isAdmin, deleteCategoryById);

module.exports = router; 