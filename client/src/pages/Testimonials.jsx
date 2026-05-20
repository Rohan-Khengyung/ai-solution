import { useState } from 'react'
import { mockReviews } from '../utils/mockData'
import { mockAPI } from '../services/api'

const Testimonials = () => {
  const [reviews, setReviews] = useState(mockReviews.filter(r => r.status === 'approved'))
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', company: '', rating: 5, comment: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newReview = {
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    }
    await mockAPI.createReview(newReview)
    setSubmitted(true)
    setTimeout(() => {
      setShowForm(false)
      setSubmitted(false)
      setFormData({ name: '', company: '', rating: 5, comment: '' })
    }, 2000)
  }

  const stats = {
    avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    totalReviews: reviews.length,
    satisfaction: Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100),
    globalClients: 500
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-blue-400 font-semibold mb-2">CLIENT STORIES</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Testimonials</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See what our clients say about working with AI Solutions.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.avgRating}</div>
              <div className="text-yellow-400 text-xl">★★★★★</div>
              <div className="text-sm text-gray-600 mt-1">AVERAGE RATING</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.totalReviews}+</div>
              <div className="text-sm text-gray-600 mt-1">VERIFIED REVIEWS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.satisfaction}%</div>
              <div className="text-sm text-gray-600 mt-1">SATISFACTION RATE</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">{stats.globalClients}+</div>
              <div className="text-sm text-gray-600 mt-1">GLOBAL CLIENTS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Write Review Button */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Write a Review
          </button>
        </div>
      </section>

      {/* Review Form */}
      {showForm && (
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-gray-50 rounded-xl p-6 shadow-md">
              <h3 className="text-2xl font-bold mb-4">Share Your Experience</h3>
              {submitted ? (
                <div className="text-center py-8 text-green-600">Thank you! Your review is pending approval.</div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input type="text" required className="w-full px-3 py-2 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-lg" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Rating *</label>
                    <select className="w-full px-3 py-2 border rounded-lg" value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}>
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Comment *</label>
                    <textarea required rows={4} className="w-full px-3 py-2 border rounded-lg" value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">Submit Review</button>
                </form>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Reviews List */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map(review => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{review.name}</h3>
                    <p className="text-sm text-gray-500">{review.company}</p>
                  </div>
                  <div className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                </div>
                <p className="text-gray-700 mb-4">"{review.comment}"</p>
                <p className="text-sm text-gray-400">{review.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Testimonials