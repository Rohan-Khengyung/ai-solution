import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { mockAPI } from '../services/api'

const AdminDashboard = () => {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState('enquiries')
  const [enquiries, setEnquiries] = useState([])
  const [reviews, setReviews] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [gallery, setGallery] = useState([])
  const [contactDetails, setContactDetails] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [newBlog, setNewBlog] = useState({ title: '', excerpt: '', content: '', image: '' })
  const [newGalleryItem, setNewGalleryItem] = useState({ title: '', image: '', category: 'event' })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setEnquiries(await mockAPI.getEnquiries())
    setReviews(await mockAPI.getReviews())
    setBlogPosts(await mockAPI.getBlogPosts())
    setGallery(await mockAPI.getGalleryItems())
    setContactDetails(await mockAPI.getContactDetails())
  }

  const handleUpdateStatus = async (id, status) => {
    await mockAPI.updateEnquiryStatus(id, status)
    loadData()
  }

  const handleDeleteEnquiry = async (id) => {
    if (window.confirm('Delete this enquiry?')) {
      await mockAPI.deleteEnquiry(id)
      loadData()
    }
  }

  const handleApproveReview = async (id) => {
    await mockAPI.approveReview(id)
    loadData()
  }

  const handleDeleteReview = async (id) => {
    await mockAPI.deleteReview(id)
    loadData()
  }

  const handleAddBlog = async () => {
    if (newBlog.title && newBlog.content) {
      await mockAPI.createBlogPost(newBlog)
      setNewBlog({ title: '', excerpt: '', content: '', image: '' })
      loadData()
    }
  }

  const handleDeleteBlog = async (id) => {
    await mockAPI.deleteBlogPost(id)
    loadData()
  }

  const handleAddGallery = async () => {
    if (newGalleryItem.title && newGalleryItem.image) {
      await mockAPI.createGalleryItem(newGalleryItem)
      setNewGalleryItem({ title: '', image: '', category: 'event' })
      loadData()
    }
  }

  const handleDeleteGallery = async (id) => {
    await mockAPI.deleteGalleryItem(id)
    loadData()
  }

  const handleUpdateContact = async () => {
    await mockAPI.updateContactDetails(contactDetails)
    alert('Contact details updated')
  }

  const filteredEnquiries = enquiries.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.email.toLowerCase().includes(searchTerm.toLowerCase()) || e.company.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="font-bold text-xl">AI SOLUTIONS Admin</span>
          </div>
          <button onClick={logout} className="text-red-600 hover:text-red-700">Sign Out</button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-4 mb-8 border-b">
          {['enquiries', 'reviews', 'blog', 'gallery', 'contact'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 px-1 capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600'}`}>{tab}</button>
          ))}
        </div>

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow"><div className="text-2xl font-bold">{enquiries.length}</div><div className="text-gray-600">Total Enquiries</div></div>
              <div className="bg-white p-4 rounded-lg shadow"><div className="text-2xl font-bold">{enquiries.filter(e => e.status === 'new').length}</div><div className="text-gray-600">New</div></div>
              <div className="bg-white p-4 rounded-lg shadow"><div className="text-2xl font-bold">{enquiries.filter(e => e.status === 'processed').length}</div><div className="text-gray-600">Processed</div></div>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b"><input type="text" placeholder="Search by name, email or company..." className="w-full px-3 py-2 border rounded-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Company</th><th className="px-4 py-3 text-left">Country</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Actions</th></tr></thead>
                  <tbody>
                    {filteredEnquiries.map(e => (
                      <tr key={e._id} className="border-t"><td className="px-4 py-3">{e.name}</td><td className="px-4 py-3">{e.email}</td><td className="px-4 py-3">{e.company}</td><td className="px-4 py-3">{e.country}</td><td className="px-4 py-3">{e.date}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${e.status === 'new' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{e.status}</span></td><td className="px-4 py-3"><button onClick={() => handleUpdateStatus(e._id, 'processed')} className="text-blue-600 mr-2">✓</button><button onClick={() => handleDeleteEnquiry(e._id)} className="text-red-600">🗑</button></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold mb-4">Pending Reviews</h3>
            {reviews.filter(r => r.status === 'pending').map(r => (
              <div key={r._id} className="border-b py-4"><p><strong>{r.name}</strong> - {r.company} - Rating: {r.rating}★</p><p className="text-gray-600">{r.comment}</p><div className="mt-2"><button onClick={() => handleApproveReview(r._id)} className="bg-green-600 text-white px-3 py-1 rounded mr-2">Approve</button><button onClick={() => handleDeleteReview(r._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button></div></div>
            ))}
            <h3 className="font-bold mt-6 mb-4">Approved Reviews</h3>
            {reviews.filter(r => r.status === 'approved').map(r => (
              <div key={r._id} className="border-b py-4"><p><strong>{r.name}</strong> - {r.company} - Rating: {r.rating}★</p><p className="text-gray-600">{r.comment}</p><button onClick={() => handleDeleteReview(r._id)} className="mt-2 text-red-600">Delete</button></div>
            ))}
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold mb-4">Add New Blog Post</h3>
            <div className="space-y-3"><input type="text" placeholder="Title" className="w-full px-3 py-2 border rounded" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} /><input type="text" placeholder="Excerpt" className="w-full px-3 py-2 border rounded" value={newBlog.excerpt} onChange={e => setNewBlog({...newBlog, excerpt: e.target.value})} /><textarea placeholder="Content" rows={4} className="w-full px-3 py-2 border rounded" value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} /><input type="text" placeholder="Image URL" className="w-full px-3 py-2 border rounded" value={newBlog.image} onChange={e => setNewBlog({...newBlog, image: e.target.value})} /><button onClick={handleAddBlog} className="bg-blue-600 text-white px-4 py-2 rounded">Add Post</button></div>
            <h3 className="font-bold mt-8 mb-4">Existing Posts</h3>
            {blogPosts.map(p => (<div key={p._id} className="border-b py-3 flex justify-between"><div><strong>{p.title}</strong><br /><span className="text-sm text-gray-500">{p.date}</span></div><button onClick={() => handleDeleteBlog(p._id)} className="text-red-600">Delete</button></div>))}
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold mb-4">Add New Gallery Image</h3>
            <div className="space-y-3"><input type="text" placeholder="Title" className="w-full px-3 py-2 border rounded" value={newGalleryItem.title} onChange={e => setNewGalleryItem({...newGalleryItem, title: e.target.value})} /><input type="text" placeholder="Image URL" className="w-full px-3 py-2 border rounded" value={newGalleryItem.image} onChange={e => setNewGalleryItem({...newGalleryItem, image: e.target.value})} /><select className="w-full px-3 py-2 border rounded" value={newGalleryItem.category} onChange={e => setNewGalleryItem({...newGalleryItem, category: e.target.value})}><option>event</option><option>team</option><option>product</option></select><button onClick={handleAddGallery} className="bg-blue-600 text-white px-4 py-2 rounded">Add Image</button></div>
            <h3 className="font-bold mt-8 mb-4">Gallery Items</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{gallery.map(g => (<div key={g._id} className="relative"><img src={g.image} alt={g.title} className="w-full h-32 object-cover rounded" /><button onClick={() => handleDeleteGallery(g._id)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-sm">×</button><p className="text-sm mt-1">{g.title}</p></div>))}</div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold mb-4">Edit Contact Details</h3>
            <div className="space-y-3"><input type="text" placeholder="Email" className="w-full px-3 py-2 border rounded" value={contactDetails.email} onChange={e => setContactDetails({...contactDetails, email: e.target.value})} /><input type="text" placeholder="Phone" className="w-full px-3 py-2 border rounded" value={contactDetails.phone} onChange={e => setContactDetails({...contactDetails, phone: e.target.value})} /><input type="text" placeholder="Address" className="w-full px-3 py-2 border rounded" value={contactDetails.address} onChange={e => setContactDetails({...contactDetails, address: e.target.value})} /><input type="text" placeholder="Hours" className="w-full px-3 py-2 border rounded" value={contactDetails.hours} onChange={e => setContactDetails({...contactDetails, hours: e.target.value})} /><button onClick={handleUpdateContact} className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard