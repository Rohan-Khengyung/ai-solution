const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('./emailController');

// Get all admin users
const getUsers = async (req, res) => {
  try {
    const users = await Admin.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new admin user
const createUser = async (req, res) => {
  try {
    const { username, email, password, role, recipientEmail } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    // Check if username or email already exists
    const existing = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Admin.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'viewer',
      recipientEmail: recipientEmail || email // if not provided, use login email
    });

    // Send welcome email to recipientEmail
    const toEmail = user.recipientEmail || user.email;
    const loginUrl = `${req.protocol}://${req.get('host')}/admin`;
    const html = `
      <h2>Welcome to AI Solutions Admin Panel</h2>
      <p>Hello <strong>${user.username}</strong>,</p>
      <p>Your admin account has been created with the following credentials:</p>
      <ul>
        <li><strong>Username:</strong> ${user.username}</li>
        <li><strong>Email (login):</strong> ${user.email}</li>
        <li><strong>Password:</strong> ${password}</li>
        <li><strong>Role:</strong> ${user.role}</li>
      </ul>
      <p>You can login at: <a href="${loginUrl}">${loginUrl}</a></p>
      <p>Please change your password after first login.</p>
      <p>Best regards,<br/>AI Solutions Team</p>
    `;
    sendEmail(toEmail, 'Your Admin Account Created', html).catch(err => console.error('Welcome email error:', err));

    // Return user without password
    const userData = user.toObject();
    delete userData.password;
    res.status(201).json({ success: true, data: userData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an admin user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role, recipientEmail } = req.body;
    const user = await Admin.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let updatedFields = [];
    if (username && username !== user.username) {
      user.username = username;
      updatedFields.push('username');
    }
    if (email && email !== user.email) {
      // Check if new email already exists
      const existing = await Admin.findOne({ email, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
      updatedFields.push('email');
    }
    if (role && role !== user.role) {
      user.role = role;
      updatedFields.push('role');
    }
    // Handle recipientEmail
    if (recipientEmail !== undefined) {
      if (recipientEmail !== user.recipientEmail) {
        user.recipientEmail = recipientEmail || email; // if empty, fallback to login email
        updatedFields.push('recipientEmail');
      }
    }
    let passwordChanged = false;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
      passwordChanged = true;
      updatedFields.push('password');
    }

    await user.save();

    // Send notification email if any fields changed
    if (updatedFields.length > 0) {
      const toEmail = user.recipientEmail || user.email;
      const fieldsStr = updatedFields.join(', ');
      const loginUrl = `${req.protocol}://${req.get('host')}/admin`;
      let html = `
        <h2>Your Admin Account Has Been Updated</h2>
        <p>Hello <strong>${user.username}</strong>,</p>
        <p>The following fields were updated: <strong>${fieldsStr}</strong>.</p>
      `;
      if (passwordChanged) {
        html += `<p>Your new password is: <strong>${password}</strong></p>`;
      }
      html += `
        <p>You can login at: <a href="${loginUrl}">${loginUrl}</a></p>
        <p>Best regards,<br/>AI Solutions Team</p>
      `;
      sendEmail(toEmail, 'Your Admin Account Updated', html).catch(err => console.error('Update email error:', err));
    }

    // Return user without password
    const userData = user.toObject();
    delete userData.password;
    res.json({ success: true, data: userData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an admin user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Admin.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const email = user.recipientEmail || user.email;
    const username = user.username;

    await user.deleteOne();

    // Send deletion notification to recipientEmail
    const html = `
      <h2>Your Admin Account Has Been Deleted</h2>
      <p>Hello <strong>${username}</strong>,</p>
      <p>Your admin account at AI Solutions has been permanently deleted.</p>
      <p>If this was done in error, please contact the system administrator.</p>
      <p>Best regards,<br/>AI Solutions Team</p>
    `;
    sendEmail(email, 'Your Admin Account Deleted', html).catch(err => console.error('Deletion email error:', err));

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };