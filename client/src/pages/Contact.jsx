import { useState, useEffect } from 'react';
import { submitEnquiry, getContactDetails } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', country: '', jobTitle: '', jobDetails: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '', address: '', hours: '' });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await getContactDetails();
        setContactInfo(res.data.data);
      } catch (err) {
        console.error(err);
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">Submit Your Job Requirements</h1>
          <p className="text-gray-600 mb-8">Tell us about your project needs and we'll respond with a customised solution.</p>
          <div className="space-y-4 mb-8">
            <div><strong>EMAIL:</strong> {contactInfo.email}</div>
            <div><strong>PHONE:</strong> {contactInfo.phone}</div>
            <div><strong>ADDRESS:</strong> {contactInfo.address}</div>
            <div><strong>HOURS:</strong> {contactInfo.hours}</div>
          </div>
          <div className="text-sm text-gray-500">We respect your privacy. Your information is used solely to respond to your enquiry.</div>
        </div>
        <div>
          {message && (
            <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block mb-1">FULL NAME *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block mb-1">EMAIL *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block mb-1">PHONE NUMBER *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block mb-1">COMPANY NAME *</label><input type="text" name="company" value={formData.company} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block mb-1">COUNTRY *</label><input type="text" name="country" value={formData.country} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block mb-1">JOB TITLE *</label><input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block mb-1">JOB / PROJECT DETAILS *</label><textarea name="jobDetails" rows="5" value={formData.jobDetails} onChange={handleChange} required className="w-full border rounded px-3 py-2"></textarea></div>
            <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;