const Event = require('../models/Events');
const EventRegistration = require('../models/EventRegistration');

// Public
const getActiveEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true, date: { $gte: new Date() } }).sort({ date: 1 });
    const pastEvents = await Event.find({ isActive: true, date: { $lt: new Date() } }).sort({ date: -1 });
    res.json({ success: true, data: { upcoming: events, past: pastEvents } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const { eventId, name, email, phone } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.registrations >= event.capacity) return res.status(400).json({ message: 'Event is full' });
    if (new Date(event.date) < new Date()) return res.status(400).json({ message: 'Event already passed' });
    
    const registration = await EventRegistration.create({
      eventId, eventTitle: event.title, name, email, phone
    });
    event.registrations += 1;
    await event.save();
    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ eventId: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: registrations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await EventRegistration.find().populate('eventId', 'title date').sort({ createdAt: -1 });
    res.json({ success: true, data: registrations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActiveEvents,
  registerForEvent,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  getAllRegistrations,
};