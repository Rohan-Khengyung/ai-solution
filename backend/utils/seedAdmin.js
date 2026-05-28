const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'superadmin'
      });
      console.log('Admin user seeded successfully');
    } else {
      // Check if current password matches env password, if not – update
      const isMatch = await bcrypt.compare(process.env.ADMIN_PASSWORD, admin.password);
      if (!isMatch) {
        const newHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        admin.password = newHash;
        await admin.save();
        console.log('Admin password updated to match .env');
      }
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

module.exports = seedAdmin;