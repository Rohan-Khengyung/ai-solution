import { useState, useEffect } from 'react';
import { submitEnquiry, getContactDetails } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', country: '', jobTitle: '', jobDetails: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    email: 'hello@aisolutions.com',
    phone: '+1 (977) 555-01399',
    address: 'Kathmandu, Nepal',
    hours: 'Mon-Fri, 9am–6pm PST'
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await getContactDetails();
        if (res.data.data) {
          setContactInfo(prev => ({ ...prev, ...res.data.data }));
        }
      } catch (err) {
        console.error('Using default Kathmandu location');
      }
    };
    fetchContact();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitEnquiry(formData);
      setMessage({ type: 'success', text: 'Enquiry submitted successfully! We will contact you soon.' });
      setFormData({ name: '', email: '', phone: '', company: '', country: '', jobTitle: '', jobDetails: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  // Google Maps embed for Kathmandu, Nepal
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent('Kathmandu, Nepal')}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* LEFT COLUMN: Info + Map */}
        <div className="space-y-8">
          {/* Info Section */}
          <div>
            <h1 className="text-4xl font-bold mb-4">Submit Your Job Requirements</h1>
            <p className="text-gray-600 mb-6">
              Tell us about your project needs and we'll respond with a customised solution.
            </p>
            <div className="space-y-3 mb-6">
              <div><strong>Email:</strong> {contactInfo.email}</div>
              <div><strong>Phone:</strong> {contactInfo.phone}</div>
              <div><strong>Address:</strong> {contactInfo.address}</div>
              <div><strong>Hours:</strong> {contactInfo.hours}</div>
            </div>
            <div className="text-sm text-gray-500">
              We respect your privacy. Your information is used solely to respond to your enquiry.
            </div>
          </div>

          {/* Map Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Our Location</h2>
            <div className="w-full h-80 md:h-96 lg:h-[450px] rounded-lg overflow-hidden shadow-md">
              <iframe
                title="Company Location Map - Kathmandu, Nepal"
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Form Container (unchanged) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {message && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Phone Number *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Company Name *</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Country *</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Job Title *</label>
              <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Job / Project Details *</label>
              <textarea name="jobDetails" rows="5" value={formData.jobDetails} onChange={handleChange} required className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-semibold">
              {submitting ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;