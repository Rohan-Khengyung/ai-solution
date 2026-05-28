import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { submitEnquiry, getContactDetails } from '../services/api';
import { CheckCircle, Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

const COUNTRIES = [
  'United Kingdom', 'Nepal', 'United States', 'Canada', 'Australia', 'Germany', 'France',
  'Spain', 'Italy', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Ireland',
  'India', 'Singapore', 'UAE', 'Saudi Arabia', 'Japan', 'South Korea',
  'Brazil', 'Mexico', 'South Africa', 'Nigeria', 'Kenya', 'Other',
];

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    jobTitle: '',
    jobDetails: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: 'hello@ai-solutions.co.uk',
    phone: '+44 (0)191 123 4567',
    address: 'Sunderland Tech Hub, Sunderland, UK SR1 3EQ',
    hours: 'Mon–Fri: 9am – 6pm GMT',
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await getContactDetails();
        if (res.data.data) {
          setContactInfo(prev => ({ ...prev, ...res.data.data }));
        }
      } catch (err) {
        console.error('Using default contact info');
      }
    };
    fetchContact();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email address';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.company.trim()) errs.company = 'Company name is required';
    if (!form.country) errs.country = 'Please select your country';
    if (!form.jobTitle.trim()) errs.jobTitle = 'Job title is required';
    if (!form.jobDetails.trim()) errs.jobDetails = 'Please tell us about your project or requirements';
    else if (form.jobDetails.trim().length < 20) errs.jobDetails = 'Please provide at least 20 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await submitEnquiry(form);
      setSubmitted(true);
      setForm({
        name: '', email: '', phone: '', company: '', country: '', jobTitle: '', jobDetails: '',
      });
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Submission failed' });
    }
  };

  const update = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const inputBase = (field) => ({
    width: '100%',
    padding: '16px 20px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${errors[field] ? '#ef4444' : 'rgba(99, 102, 241, 0.2)'}`,
    color: '#e2e8f0',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit',
  });

  const INFO = [
    { icon: <Mail size={22} />, label: 'Email', value: contactInfo.email, color: '#6366f1' },
    { icon: <Phone size={22} />, label: 'Phone', value: contactInfo.phone, color: '#06b6d4' },
    { icon: <MapPin size={22} />, label: 'Office', value: contactInfo.address, color: '#10b981' },
    { icon: <Clock size={22} />, label: 'Business Hours', value: contactInfo.hours, color: '#f59e0b' },
  ];

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
          width: '600px', height: '350px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.07) 0%, transparent 70%)',
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
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            marginBottom: '24px',
          }}>
            <MessageSquare size={14} color="#22d3ee" />
            <span style={{ color: '#22d3ee', fontSize: '0.85rem', fontWeight: 500 }}>Get In Touch</span>
          </div>
          <h1 style={{ 
            color: '#f1f5f9', 
            marginBottom: '20px', 
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',  // Much larger, responsive
            fontWeight: 'bold',
            lineHeight: 1.2,
            letterSpacing: '-0.02em' }}>
            Tell Us About Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Project
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            Share your requirements and our team will respond within 24 hours with a tailored proposal.
          </p>
        </motion.div>
      </section>

      {/* Content Section - Wider form & responsive */}
      <section style={{ padding: '60px 24px 120px' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr', // Form now 2x wider than contact info
          gap: '60px',
          alignItems: 'start',
        }} className="contact-grid">
          {/* Left Column: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 style={{ color: '#f1f5f9', marginBottom: '12px' }}>Let's Start a Conversation</h2>
            <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: '40px', fontSize: '0.95rem' }}>
              Whether you have a fully defined project or just an idea, we'd love to hear from you.
              Our solution consultants are ready to help.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
              {INFO.map(info => (
                <div key={info.label} style={{
                  display: 'flex', gap: '16px', alignItems: 'flex-start',
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(10, 18, 42, 0.7)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: `${info.color}15`,
                    border: `1px solid ${info.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: info.color, flexShrink: 0,
                  }}>
                    {info.icon}
                  </div>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {info.label}
                    </div>
                    <div style={{ color: '#e2e8f0', fontSize: '1rem' }}>{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: '24px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.18)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <CheckCircle size={20} color="#10b981" />
                <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '1rem' }}>Guaranteed Response</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                We respond to all enquiries within <strong style={{ color: '#a5b4fc' }}>24 business hours</strong>.
                Urgent projects can be fast-tracked — mention it in your message.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Wider Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  padding: '80px 48px',
                  borderRadius: '24px',
                  background: 'rgba(10, 18, 42, 0.7)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  textAlign: 'center',
                }}
              >
                <CheckCircle size={72} color="#10b981" style={{ marginBottom: '28px' }} />
                <h2 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: '2rem' }}>Enquiry Received!</h2>
                <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: '1rem' }}>
                  Thank you for reaching out. Our team will review your requirements and get back to you within <strong style={{ color: '#a5b4fc' }}>24 hours</strong>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    marginTop: '36px',
                    padding: '14px 32px', borderRadius: '12px', cursor: 'pointer',
                    color: '#a5b4fc', fontWeight: 600, fontSize: '0.95rem',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                  }}
                >
                  Submit Another Enquiry
                </button>
              </motion.div>
            ) : (
              <div style={{
                padding: '56px',
                borderRadius: '24px',
                background: 'rgba(10, 18, 42, 0.8)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                backdropFilter: 'blur(20px)',
              }}>
                <h3 style={{ color: '#f1f5f9', marginBottom: '32px', fontSize: '1.8rem', fontWeight: 700 }}>Contact Us Form</h3>
                {errors.form && (
                  <div style={{ marginBottom: '20px', padding: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '12px', color: '#f87171', fontSize: '0.9rem' }}>
                    {errors.form}
                  </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Full Name <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input type="text" placeholder="John Smith" value={form.name} onChange={update('name')} style={inputBase('name')} />
                      {errors.name && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Email Address <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input type="email" placeholder="john@company.com" value={form.email} onChange={update('email')} style={inputBase('email')} />
                      {errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>{errors.email}</p>}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Phone Number <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input type="tel" placeholder="+44 7700 900123" value={form.phone} onChange={update('phone')} style={inputBase('phone')} />
                      {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>{errors.phone}</p>}
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Company Name <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input type="text" placeholder="Your Company Ltd" value={form.company} onChange={update('company')} style={inputBase('company')} />
                      {errors.company && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>{errors.company}</p>}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Country <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <select value={form.country} onChange={update('country')} style={{ ...inputBase('country'), appearance: 'none' }}>
                        <option value="">Select country...</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.country && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>{errors.country}</p>}
                    </div>
                    <div>
                      <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                        Job Title <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input type="text" placeholder="CTO / Product Manager" value={form.jobTitle} onChange={update('jobTitle')} style={inputBase('jobTitle')} />
                      {errors.jobTitle && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>{errors.jobTitle}</p>}
                    </div>
                  </div>

                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                      Job / Project Details <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      placeholder="Please describe your project requirements, current challenges, timeline, and any other relevant information..."
                      value={form.jobDetails}
                      onChange={update('jobDetails')}
                      rows={6}
                      style={{ ...inputBase('jobDetails'), resize: 'vertical' }}
                    />
                    {errors.jobDetails && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '6px' }}>{errors.jobDetails}</p>}
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.8rem', lineHeight: 1.5 }}>
                    By submitting this form, you agree to our Privacy Policy. We will never share your information with third parties.
                  </p>

                  <button
                    type="submit"
                    style={{
                      padding: '16px 36px', borderRadius: '12px', cursor: 'pointer',
                      color: 'white', fontWeight: 700, fontSize: '1.05rem',
                      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                      border: 'none', width: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                      boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Send size={20} />
                    Send Enquiry
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Responsive Styles */}
      <style>
        {`
          @media (max-width: 1024px) {
            .contact-grid {
              grid-template-columns: 1fr !important;
              gap: 48px !important;
            }
          }
          @media (max-width: 768px) {
            .contact-grid > div:first-child {
              order: 2;
            }
            .contact-grid > div:last-child {
              order: 1;
            }
            .contact-grid {
              padding: 0 16px;
            }
            .contact-grid > div:last-child > div {
              padding: 32px 20px !important;
            }
            .contact-grid > div:last-child form > div {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
            input, select, textarea {
              font-size: 16px !important; /* Prevents zoom on mobile */
            }
          }
          @media (max-width: 480px) {
            .contact-grid > div:last-child > div {
              padding: 24px 16px !important;
            }
            h1 {
              font-size: 1.8rem !important;
            }
            h2, h3 {
              font-size: 1.4rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Contact;