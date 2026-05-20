import { useState } from 'react'
import { mockAPI } from '../services/api'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: 'Jane Smith',
    email: '',
    phone: '',
    company: 'Acme Corp',
    country: 'United States',
    jobTitle: 'CTO / Product Manager',
    jobDetails: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.name) newErrors.name = 'Required'
    if (!formData.email) newErrors.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.phone) newErrors.phone = 'Required'
    if (!formData.jobDetails) newErrors.jobDetails = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    await mockAPI.createEnquiry(formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const contactDetails = {
    email: 'hello@aisolutions.com',
    phone: '+1 (800) 555-0199',
    address: '100 Market St, San Francisco, CA',
    hours: 'Mon-Fri, 9am–6pm PST'
  }

  return (
    <div>
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-400 font-semibold mb-2">AI-POWERED PLATFORM</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Submit Your Job Requirements</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tell us about your project needs and we'll respond with a customised solution.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Details */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
                <h3 className="text-xl font-bold mb-4">CONTACT DETAILS</h3>
                <div className="space-y-4">
                  <div><p className="text-sm text-gray-500">EMAIL</p><p className="font-medium">{contactDetails.email}</p></div>
                  <div><p className="text-sm text-gray-500">PHONE</p><p className="font-medium">{contactDetails.phone}</p></div>
                  <div><p className="text-sm text-gray-500">ADDRESS</p><p className="font-medium">{contactDetails.address}</p></div>
                  <div><p className="text-sm text-gray-500">HOURS</p><p className="font-medium">{contactDetails.hours}</p></div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">ALL FIELDS REQUIRED</p>
                  <p className="text-xs text-gray-600 mt-1">We respect your privacy. Your information is used solely to respond to your enquiry.</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-md">
                <h3 className="text-2xl font-bold mb-6">YOUR INFORMATION</h3>
                {submitted ? (
                  <div className="text-center py-8 text-green-600">Thank you! We'll get back to you shortly.</div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className="block text-sm font-medium mb-1">FULL NAME *</label><input type="text" className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : ''}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                      <div><label className="block text-sm font-medium mb-1">PHONE NUMBER *</label><input type="tel" className={`w-full px-3 py-2 border rounded-lg ${errors.phone ? 'border-red-500' : ''}`} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
                      <div><label className="block text-sm font-medium mb-1">EMAIL *</label><input type="email" className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : ''}`} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                      <div><label className="block text-sm font-medium mb-1">COMPANY NAME *</label><input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} /></div>
                      <div><label className="block text-sm font-medium mb-1">COUNTRY *</label><select className="w-full px-3 py-2 border rounded-lg" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})}><option>United States</option><option>United Kingdom</option><option>Canada</option><option>Australia</option><option>India</option></select></div>
                      <div><label className="block text-sm font-medium mb-1">JOB TITLE *</label><input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} /></div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-sm font-medium mb-1">JOB / PROJECT DETAILS *</label>
                      <textarea rows={6} className={`w-full px-3 py-2 border rounded-lg ${errors.jobDetails ? 'border-red-500' : ''}`} placeholder="Please describe your project requirements, goals, timeline, and any specific challenges..." value={formData.jobDetails} onChange={e => setFormData({...formData, jobDetails: e.target.value})}></textarea>
                    </div>
                    <button type="submit" className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Submit Enquiry</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact