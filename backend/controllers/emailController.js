const nodemailer = require('nodemailer');

// Create transporter with proper config
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('EMAIL_USER or EMAIL_PASS not set in .env');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // false for port 587 (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Gmail specific: allow less secure connections (not needed with App Password)
    // tls: {
    //   rejectUnauthorized: false
    // }
  });
};

// Send email function with detailed error
const sendEmail = async (to, subject, html, text = '') => {
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('Email transporter not configured. Check EMAIL_USER and EMAIL_PASS.');
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"AI Solutions" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || html.replace(/<[^>]+>/g, '').substring(0, 500),
      html,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    // Throw user-friendly message
    if (error.code === 'EAUTH') {
      throw new Error('Authentication failed. Check your email credentials or App Password.');
    } else if (error.code === 'ESOCKET') {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
};

// Admin: Send custom email (used by dashboard)
const sendCustomEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    if (!to || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Missing fields: to, subject, message' });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    // Convert newlines to <br> for HTML email
    const htmlMessage = message.replace(/\n/g, '<br>');
    await sendEmail(to, subject, `<p>${htmlMessage}</p>`);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('sendCustomEmail error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send email' });
  }
};

module.exports = { sendEmail, sendCustomEmail };