import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, X, CheckCircle, ChevronRight, Ticket } from 'lucide-react';
import { getEvents, registerForEventAPI } from '../services/api';

const RegistrationModal = ({ event, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setApiError(null);
    try {
      // Use event._id or event.id (both work after mapping)
      await registerForEventAPI({ eventId: event._id || event.id, ...form });
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a1228] border border-indigo-500/30 rounded-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-indigo-500/20 flex justify-between items-center">
          <div>
            <h3 className="text-white text-xl font-bold">Register for Event</h3>
            <p className="text-slate-400 text-sm">{event?.title}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
              <h3 className="text-white text-xl mb-2">You're Registered!</h3>
              <p className="text-slate-400">Confirmation sent to {form.email}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {apiError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">{apiError}</div>}
              <div>
                <label className="block text-slate-300 text-sm mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-2 text-white"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-1">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-2 text-white"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div className="bg-indigo-500/10 p-3 rounded-lg flex items-center gap-2 text-sm text-slate-300">
                <Calendar size={16} className="text-indigo-400" />
                {event?.date ? new Date(event.date).toLocaleDateString() : 'Date TBA'}
                <MapPin size={16} className="text-indigo-400 ml-2" />
                {event?.location || 'Location TBA'}
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
                Confirm Registration <Ticket size={18} />
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Events = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registerFor, setRegisterFor] = useState(null);

  const fetchEvents = async () => {
    try {
      const res = await getEvents();
      // Map backend _id to id for compatibility
      const upcomingEvents = (res.data.data.upcoming || []).map(event => ({
        ...event,
        id: event._id
      }));
      const pastEvents = (res.data.data.past || []).map(event => ({
        ...event,
        id: event._id
      }));
      setUpcoming(upcomingEvents);
      setPast(pastEvents);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const EventCard = ({ event, isPast }) => {
    const spotsLeft = Math.max(0, event.capacity - event.registrations);
    const pctFull = (event.registrations / event.capacity) * 100;
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`bg-white/5 backdrop-blur-lg border border-indigo-500/20 rounded-2xl overflow-hidden md:flex ${isPast ? 'opacity-70' : ''}`}
      >
        <div className="md:w-2/5 h-64 md:h-auto relative">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          {!isPast && spotsLeft < 20 && spotsLeft > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Only {spotsLeft} left!</div>
          )}
        </div>
        <div className="p-6 md:w-3/5">
          <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
          <p className="text-slate-400 mb-4">{event.description}</p>
          <div className="space-y-2 text-sm text-slate-300 mb-4">
            <div className="flex items-center gap-2"><Calendar size={16} className="text-indigo-400"/>{new Date(event.date).toLocaleDateString()}</div>
            <div className="flex items-center gap-2"><Clock size={16} className="text-indigo-400"/>{event.time}</div>
            <div className="flex items-center gap-2"><MapPin size={16} className="text-indigo-400"/>{event.location}</div>
            <div className="flex items-center gap-2"><Users size={16} className="text-indigo-400"/>{event.registrations} / {event.capacity} registered</div>
          </div>
          <div className="mb-4">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" style={{ width: `${pctFull}%` }} />
            </div>
          </div>
          {!isPast && spotsLeft > 0 ? (
            <button onClick={() => setRegisterFor(event)} className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2">
              Register Now <ChevronRight size={16} />
            </button>
          ) : !isPast ? (
            <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm inline-block">Fully Booked</div>
          ) : (
            <div className="text-slate-500 text-sm">Past Event</div>
          )}
        </div>
      </motion.div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#030712]"><div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="bg-[#030712] pt-20">
      <section className="py-20 px-4 text-center bg-gradient-to-b from-[#060f24] to-[#030712]">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 text-emerald-400 text-sm mb-6">
          <Calendar size={14} /> Upcoming Events
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Join Our <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">Events</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto">Connect with AI leaders, attend workshops, and be part of Sunderland's growing tech community.</p>
      </section>

      <section className="container mx-auto px-4 py-12 space-y-12">
        {upcoming.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
            <div className="space-y-6">{upcoming.map(event => <EventCard key={event._id} event={event} isPast={false} />)}</div>
          </div>
        )}
        {past.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Past Events</h2>
            <div className="space-y-6">{past.map(event => <EventCard key={event._id} event={event} isPast={true} />)}</div>
          </div>
        )}
        {upcoming.length === 0 && past.length === 0 && <div className="text-center text-slate-500 py-12">No events scheduled. Check back soon!</div>}
      </section>

      <AnimatePresence>
        {registerFor && (
          <RegistrationModal
            event={registerFor}
            onClose={() => setRegisterFor(null)}
            onSuccess={() => {
              setRegisterFor(null);
              fetchEvents(); // Refresh to show updated registrations
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;