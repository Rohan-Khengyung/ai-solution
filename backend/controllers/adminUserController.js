const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Get all admin users (excluding passwords)
const getUsers = async (req, res) => {
  try {
    const users = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new admin user
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Check if username or email already exists
    const existing = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Admin.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'viewer'
    });
    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ success: true, data: userObj });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update an admin user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, isActive } = req.body;
    const user = await Admin.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Prevent self-update of own role to lower than admin? But we'll allow.
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    res.json({ success: true, data: userObj });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete an admin user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Prevent self-deletion
    if (id === req.admin._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }
    const user = await Admin.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };