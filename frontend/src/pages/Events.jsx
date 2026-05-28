import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, X, CheckCircle, ChevronRight, Ticket } from 'lucide-react';

// ========== Local storage helpers (replace with API calls later) ==========
const STORAGE_KEYS = {
  EVENTS: 'ai_events',
  REGISTRATIONS: 'ai_event_registrations',
};

// Sample initial events (if none exist)
const DEFAULT_EVENTS = [
  {
    id: '1',
    title: 'AI Innovation Summit 2026',
    description: 'Join industry leaders to explore the latest in AI technology and innovation. Two days of talks, workshops, and networking.',
    date: '2026-06-15',
    time: '09:00 – 17:00 BST',
    location: 'Sunderland Tech Hub, Sunderland, UK',
    image: 'https://picsum.photos/800/500?random=1',
    capacity: 100,
    registrations: 45,
  },
  {
    id: '2',
    title: 'Virtual Assistant Workshop',
    description: 'Hands-on workshop demonstrating how to implement AI assistants in your organization effectively.',
    date: '2026-07-08',
    time: '14:00 – 16:00 BST',
    location: 'Online Webinar',
    image: 'https://picsum.photos/800/500?random=2',
    capacity: 200,
    registrations: 132,
  },
  {
    id: '3',
    title: 'Automation Excellence Conference',
    description: 'Learn best practices for business process automation and digital transformation from leading practitioners.',
    date: '2026-08-22',
    time: '10:00 – 18:00 BST',
    location: 'New York, NY (Hybrid)',
    image: 'https://picsum.photos/800/500?random=3',
    capacity: 150,
    registrations: 148,
  },
];

const getEvents = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
  return DEFAULT_EVENTS;
};

const saveEvents = (events) => {
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
};

const registerForEvent = ({ eventId, eventTitle, name, email, phone }) => {
  // Update registrations count
  const events = getEvents();
  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex !== -1 && events[eventIndex].registrations < events[eventIndex].capacity) {
    events[eventIndex].registrations += 1;
    saveEvents(events);
  }
  // Store registration details (optional)
  const registrations = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTRATIONS) || '[]');
  registrations.push({ eventId, eventTitle, name, email, phone, registeredAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
};

// ========== Registration Modal Component ==========
const RegistrationModal = ({ event, onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    registerForEvent({
      eventId: event.id,
      eventTitle: event.title,
      name: form.name,
      email: form.email,
      phone: form.phone,
    });
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${errors[field] ? '#ef4444' : 'rgba(99, 102, 241, 0.2)'}`,
    color: '#e2e8f0',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(3, 7, 18, 0.9)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        style={{
          width: '100%', maxWidth: '500px',
          borderRadius: '20px',
          background: '#0a1228',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, transparent 100%)',
        }}>
          <div>
            <h3 style={{ color: '#f1f5f9', marginBottom: '4px' }}>Register for Event</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{event.title}</p>
          </div>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '28px' }}>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '32px 0' }}
            >
              <CheckCircle size={56} color="#10b981" style={{ marginBottom: '20px' }} />
              <h3 style={{ color: '#f1f5f9', marginBottom: '12px' }}>You're Registered!</h3>
              <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                We've confirmed your spot at <strong style={{ color: '#a5b4fc' }}>{event.title}</strong>. A confirmation will be sent to {form.email}.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                  style={inputStyle('name')}
                />
                {errors.name && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px' }}>{errors.name}</p>}
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john@company.com"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                  style={inputStyle('email')}
                />
                {errors.email && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px' }}>{errors.email}</p>}
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+44 7700 900123"
                  value={form.phone}
                  onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                  style={inputStyle('phone')}
                />
                {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px' }}>{errors.phone}</p>}
              </div>

              <div style={{
                padding: '14px 16px', borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.06)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
              }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748b', fontSize: '0.83rem', marginBottom: '6px' }}>
                  <Calendar size={14} color="#6366f1" />
                  {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#64748b', fontSize: '0.83rem' }}>
                  <MapPin size={14} color="#6366f1" />
                  {event.location}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  padding: '14px', borderRadius: '10px', cursor: 'pointer',
                  color: 'white', fontWeight: 700, fontSize: '1rem',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  border: 'none', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                Confirm Registration <Ticket size={18} />
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ========== Main Events Component ==========
const Events = () => {
  const [events, setEvents] = useState([]);
  const [registerFor, setRegisterFor] = useState(null);

  const reloadEvents = () => {
    setEvents(getEvents());
  };

  useEffect(() => {
    reloadEvents();
  }, []);

  const spotsLeft = (event) => Math.max(0, event.capacity - event.registrations);
  const pctFull = (event) => Math.min(100, (event.registrations / event.capacity) * 100);
  const isPast = (date) => new Date(date) < new Date();

  return (
    <div style={{ background: '#030712', paddingTop: '80px' }}>
      {/* Hero Section */}
      <section style={{
        padding: '80px 24px 60px',
        background: 'linear-gradient(180deg, #060f24 0%, #030712 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'relative' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '999px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            marginBottom: '24px',
          }}>
            <Calendar size={14} color="#34d399" />
            <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 500 }}>Upcoming Events</span>
          </div>
          <h1 style={{ 
            color: '#f1f5f9', 
            marginBottom: '20px', 
            fontSize: '5.5rem', 
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',  // Much larger, responsive
            fontWeight: 'bold',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}>
            Join Our{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Events
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            Connect with AI leaders, attend workshops, and be part of Sunderland's growing tech community.
          </p>
        </motion.div>
      </section>

      {/* Events List */}
      <section style={{ padding: '60px 24px 120px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#475569' }}>
              No events scheduled at the moment. Check back soon!
            </div>
          ) : (
            events.map((event, i) => {
              const past = isPast(event.date);
              const spots = spotsLeft(event);
              const pct = pctFull(event);

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '0',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(99, 102, 241, 0.12)',
                    background: 'rgba(10, 18, 42, 0.7)',
                    backdropFilter: 'blur(20px)',
                    opacity: past ? 0.6 : 1,
                  }}
                >
                  {/* Image Side */}
                  <div style={{ position: 'relative', minHeight: '280px' }}>
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '280px' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(270deg, rgba(10, 18, 42, 0.8) 0%, transparent 60%)',
                    }} />
                    {past && (
                      <div style={{
                        position: 'absolute', top: '16px', left: '16px',
                        padding: '4px 12px', borderRadius: '999px',
                        background: 'rgba(100, 116, 139, 0.8)',
                        color: '#cbd5e1', fontSize: '0.78rem', fontWeight: 600,
                        backdropFilter: 'blur(8px)',
                      }}>
                        Past Event
                      </div>
                    )}
                    {!past && spots < 20 && spots > 0 && (
                      <div style={{
                        position: 'absolute', top: '16px', left: '16px',
                        padding: '4px 12px', borderRadius: '999px',
                        background: 'rgba(239, 68, 68, 0.85)',
                        color: 'white', fontSize: '0.78rem', fontWeight: 600,
                        backdropFilter: 'blur(8px)',
                      }}>
                        Only {spots} spots left!
                      </div>
                    )}
                  </div>

                  {/* Info Side */}
                  <div style={{ padding: '36px' }}>
                    <h2 style={{ color: '#f1f5f9', marginBottom: '16px' }}>{event.title}</h2>
                    <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '24px', fontSize: '0.95rem' }}>
                      {event.description}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                      {[
                        { icon: <Calendar size={15} />, text: new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                        { icon: <Clock size={15} />, text: event.time },
                        { icon: <MapPin size={15} />, text: event.location },
                        { icon: <Users size={15} />, text: `${event.registrations} / ${event.capacity} registered` },
                      ].map(({ icon, text }) => (
                        <div key={text} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <span style={{ color: '#6366f1', flexShrink: 0 }}>{icon}</span>
                          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: '28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Registration capacity</span>
                        <span style={{ color: pct > 80 ? '#ef4444' : '#10b981', fontSize: '0.78rem', fontWeight: 600 }}>
                          {Math.round(pct)}% full
                        </span>
                      </div>
                      <div style={{
                        height: '6px', borderRadius: '3px',
                        background: 'rgba(255,255,255,0.06)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', borderRadius: '3px',
                          width: `${pct}%`,
                          background: pct > 80
                            ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                            : 'linear-gradient(90deg, #6366f1, #06b6d4)',
                          transition: 'width 0.8s ease',
                        }} />
                      </div>
                    </div>

                    {!past && spots > 0 ? (
                      <button
                        onClick={() => setRegisterFor(event)}
                        style={{
                          padding: '13px 28px', borderRadius: '10px', cursor: 'pointer',
                          color: 'white', fontWeight: 600, fontSize: '0.95rem',
                          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                          border: 'none',
                          display: 'flex', alignItems: 'center', gap: '8px',
                        }}
                      >
                        Register Now <ChevronRight size={18} />
                      </button>
                    ) : !past ? (
                      <div style={{
                        padding: '12px 20px', borderRadius: '10px',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#f87171', fontSize: '0.9rem', fontWeight: 500,
                      }}>
                        This event is fully booked
                      </div>
                    ) : (
                      <div style={{
                        padding: '12px 20px', borderRadius: '10px',
                        background: 'rgba(100, 116, 139, 0.08)',
                        border: '1px solid rgba(100, 116, 139, 0.15)',
                        color: '#64748b', fontSize: '0.9rem',
                      }}>
                        This event has already taken place
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* Registration Modal */}
      <AnimatePresence>
        {registerFor && (
          <RegistrationModal
            event={registerFor}
            onClose={() => setRegisterFor(null)}
            onSuccess={() => { setRegisterFor(null); reloadEvents(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;