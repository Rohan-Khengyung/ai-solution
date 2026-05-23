import { useState, useEffect } from 'react';
import { CheckCircle, Mail, Phone, MapPin, Clock, Sparkles, Send } from 'lucide-react';
import { submitEnquiry, getContactDetails } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    jobTitle: '',
    jobDetails: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: 'hello@aisolutions.com',
    phone: '+1 (977) 101000101',
    address: 'Kathmandu, Nepal',
    hours: 'Mon-Fri, 9am–6pm PST',
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await getContactDetails();
        if (res.data.data) {
          setContactInfo((prev) => ({ ...prev, ...res.data.data }));
        }
      } catch (err) {
        console.error('Using default contact info');
      }
    };
    fetchContact();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Required';
    if (!formData.company.trim()) newErrors.company = 'Required';
    if (!formData.country.trim()) newErrors.country = 'Required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Required';
    if (!formData.jobDetails.trim()) newErrors.jobDetails = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await submitEnquiry(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        country: '',
        jobTitle: '',
        jobDetails: '',
      });
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-12 text-center transform transition-all duration-500 animate-fade-up">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Enquiry Received</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for reaching out. Our team will review your requirements and contact you within 1–2 business days.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  const contactItems = [
    { icon: Mail, label: 'Email', value: contactInfo.email, gradient: 'from-indigo-500 to-purple-500' },
    { icon: Phone, label: 'Phone', value: contactInfo.phone, gradient: 'from-blue-500 to-cyan-500' },
    { icon: MapPin, label: 'Address', value: contactInfo.address, gradient: 'from-emerald-500 to-teal-500' },
    { icon: Clock, label: 'Hours', value: contactInfo.hours, gradient: 'from-amber-500 to-orange-500' },
  ];

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent('Kathmandu, Nepal')}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const inputClass = (hasError) =>
    `w-full px-5 py-3 rounded-xl border-2 transition-all duration-200 ${
      hasError
        ? 'border-red-300 bg-red-50 focus:border-red-500'
        : 'border-gray-200 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
    } text-gray-900 placeholder-gray-400 focus:outline-none`;

  return (
    <>
      {/* Page Header */}
      <div className="relative overflow-hidden border-b border-indigo-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/70">
        <div className="absolute top-0 -left-48 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Get In Touch</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Submit Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Job Requirements</span>
          </h1>
          <p className="text-lg text-gray-600">
            Tell us about your project needs and we'll respond with a customised solution.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
          {/* Left Column - Sticky but also full height */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8 h-full">
              <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-6 flex items-center gap-2">
                  <span className="w-6 h-px bg-indigo-300"></span>
                  Contact Details
                </p>
                <ul className="space-y-6">
                  {contactItems.map(({ icon: Icon, label, value, gradient }) => (
                    <li key={label} className="flex items-start gap-4 group">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
                        <p className="text-sm text-gray-900 mt-1 font-medium">{value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  All Fields Required
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We respect your privacy. Your information is used solely to respond to your enquiry and will never be sold to third parties.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-lg border border-indigo-100 transition-transform hover:scale-[1.02] duration-300">
                <iframe
                  title="Company Location Map - Kathmandu, Nepal"
                  src={mapSrc}
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Column - Form with full height and bottom-aligned button */}
          <div className="lg:col-span-2 flex">
            <form onSubmit={handleSubmit} className="w-full bg-white rounded-2xl border border-indigo-100 shadow-lg p-8 md:p-10 transition-all hover:shadow-xl flex flex-col">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Your Information</p>
              </div>

              {errors.form && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
                  {errors.form}
                </div>
              )}

              <div className="flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Full Name <span className="text-indigo-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Jane Smith"
                      className={inputClass(!!errors.name)}
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-rose-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Email Address <span className="text-indigo-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="jane@company.com"
                      className={inputClass(!!errors.email)}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-rose-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Phone Number <span className="text-indigo-600">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+1 977 000 0000"
                      className={inputClass(!!errors.phone)}
                    />
                    {errors.phone && <p className="mt-1.5 text-xs text-rose-500">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Company Name <span className="text-indigo-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      placeholder="Aqua Corp"
                      className={inputClass(!!errors.company)}
                    />
                    {errors.company && <p className="mt-1.5 text-xs text-rose-500">{errors.company}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Country <span className="text-indigo-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      placeholder="Nepal"
                      className={inputClass(!!errors.country)}
                    />
                    {errors.country && <p className="mt-1.5 text-xs text-rose-500">{errors.country}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Job Title <span className="text-indigo-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) => handleChange('jobTitle', e.target.value)}
                      placeholder="CTO / Product Manager"
                      className={inputClass(!!errors.jobTitle)}
                    />
                    {errors.jobTitle && <p className="mt-1.5 text-xs text-rose-500">{errors.jobTitle}</p>}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Job / Project Details <span className="text-indigo-600">*</span>
                  </label>
                  <textarea
                    value={formData.jobDetails}
                    onChange={(e) => handleChange('jobDetails', e.target.value)}
                    rows={6}
                    placeholder="Please describe your project requirements, goals, timeline, and any specific challenges you are facing..."
                    className={`${inputClass(!!errors.jobDetails)} resize-none`}
                  />
                  {errors.jobDetails && <p className="mt-1.5 text-xs text-rose-500">{errors.jobDetails}</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-100 mt-auto">
                <p className="text-xs text-gray-400">
                  By submitting, you agree to our{' '}
                  <a href="/privacy" className="underline text-indigo-500 hover:text-indigo-700 transition-colors">
                    Privacy Policy
                  </a>.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Enquiry
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 blur-md opacity-0 group-hover:opacity-40 transition-opacity -z-10" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Contact;