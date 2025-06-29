const User = require('../models/User');
const Course = require('../models/Course');
const Category = require('../models/Category');
const RatingAndReview = require('../models/RatingAndRaview');

exports.listAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

exports.listAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate('category')
      .populate('instructor');
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch courses', error: error.message });
  }
};

exports.deleteCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    // Delete all ratings and reviews for this course
    await RatingAndReview.deleteMany({ course: id });
    // Remove this course from all users' courses arrays
    await User.updateMany(
      { courses: id },
      { $pull: { courses: id } }
    );
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete course', error: error.message });
  }
};

exports.getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    // You can add more stats as needed
    res.status(200).json({ success: true, stats: { totalUsers, totalCourses } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats', error: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Delete associated profile
    if (user.additionalDetails) {
      await require('../models/Profile').findByIdAndDelete(user.additionalDetails);
    }
    // Remove user from enrolled courses
    if (user.courses && user.courses.length > 0) {
      for (const courseId of user.courses) {
        await Course.findByIdAndUpdate(courseId, { $pull: { studentsEnrolled: id } });
      }
    }
    // Delete all ratings and reviews by this user
    await RatingAndReview.deleteMany({ user: id });
    // Remove this user from all courses' studentsEnrolled arrays
    await Course.updateMany(
      { studentsEnrolled: id },
      { $pull: { studentsEnrolled: id } }
    );
    // Delete user
    await User.findByIdAndDelete(id);
    // Optionally, delete course progress, reviews, etc.
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

exports.listAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim() === "" || !description || description.trim() === "") {
      return res.status(400).json({ success: false, message: 'Category name and description are required' });
    }
    // Check for duplicate
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }
    const category = await Category.create({ name: name.trim(), description: description.trim() });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
  }
};

exports.deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category', error: error.message });
  }
}; 