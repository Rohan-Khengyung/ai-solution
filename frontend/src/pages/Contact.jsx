import { useState, useEffect } from 'react';
import { CheckCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';
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

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-lg w-full border border-gray-200 bg-white p-12 text-center">
          <div className="w-16 h-16 border-2 border-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Enquiry Received</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for reaching out. Our team will review your requirements and contact you within 1–2 business days.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 text-white px-7 py-3 text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  // Contact details array for left panel
  const contactItems = [
    { icon: Mail, label: 'Email', value: contactInfo.email },
    { icon: Phone, label: 'Phone', value: contactInfo.phone },
    { icon: MapPin, label: 'Address', value: contactInfo.address },
    { icon: Clock, label: 'Hours', value: contactInfo.hours },
  ];

  // Google Maps embed for Kathmandu
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent('Kathmandu, Nepal')}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const inputClass = (hasError) =>
    `w-full px-4 py-3 border ${
      hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'
    } bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 transition-colors duration-150`;

  return (
    <>
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Submit Your Job Requirements</h1>
          <p className="text-lg text-gray-500">
            Tell us about your project needs and we'll respond with a customised solution.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Contact Info & Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-5">Contact Details</p>
                <ul className="space-y-5">
                  {contactItems.map(({ icon: Icon, label, value }) => (
                    <li key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
                        <p className="text-sm text-gray-900 mt-0.5">{value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">All Fields Required</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We respect your privacy. Your information is used solely to respond to your enquiry and will never be sold to third parties.
                </p>
              </div>

              {/* Map */}
              <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
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

          {/* Right Column: Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="border border-gray-200 bg-white p-6 md:p-10">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-8">Your Information</p>

              {/* Form error (global) */}
              {errors.form && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded">{errors.form}</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Full Name <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Jane Smith"
                    className={inputClass(!!errors.name)}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Email Address <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="jane@company.com"
                    className={inputClass(!!errors.email)}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Phone Number <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+1 977 000 0000"
                    className={inputClass(!!errors.phone)}
                  />
                  {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* Company */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Company Name <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Acme Corp"
                    className={inputClass(!!errors.company)}
                  />
                  {errors.company && <p className="mt-1.5 text-xs text-red-500">{errors.company}</p>}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Country <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="Nepal"
                    className={inputClass(!!errors.country)}
                  />
                  {errors.country && <p className="mt-1.5 text-xs text-red-500">{errors.country}</p>}
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Job Title <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                    placeholder="CTO / Product Manager"
                    className={inputClass(!!errors.jobTitle)}
                  />
                  {errors.jobTitle && <p className="mt-1.5 text-xs text-red-500">{errors.jobTitle}</p>}
                </div>
              </div>

              {/* Job Details */}
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Job / Project Details <span className="text-blue-600">*</span>
                </label>
                <textarea
                  value={formData.jobDetails}
                  onChange={(e) => handleChange('jobDetails', e.target.value)}
                  rows={6}
                  placeholder="Please describe your project requirements, goals, timeline, and any specific challenges you are facing..."
                  className={`${inputClass(!!errors.jobDetails)} resize-none`}
                />
                {errors.jobDetails && <p className="mt-1.5 text-xs text-red-500">{errors.jobDetails}</p>}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  By submitting, you agree to our{' '}
                  <a href="/privacy" className="underline text-gray-500 hover:text-gray-700">
                    Privacy Policy
                  </a>.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-8 py-3.5 text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Enquiry →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;