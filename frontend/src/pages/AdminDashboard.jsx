import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  getAllReviews,
  approveReview,
  deleteReview,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  addGalleryItem,
  deleteGalleryItem,
  updateContactDetails,
  getContactDetails,
  getGalleryItems,
  getAllBlogsAdmin,
} from '../services/api';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('enquiries');
  const [loading, setLoading] = useState(false);

  // Enquiries state
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryFilter, setEnquiryFilter] = useState('');
  const [enquirySearch, setEnquirySearch] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewFilter, setReviewFilter] = useState('');

  // Blog state
  const [blogPosts, setBlogPosts] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: 'AI Solutions Team',
    published: true,
  });

  // Gallery state
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    image: '',
    category: 'event',
    description: '',
  });

  // Contact state
  const [contact, setContact] = useState({
    email: '',
    phone: '',
    address: '',
    hours: '',
  });

  // Fetch all data
  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = {};
      if (enquiryFilter) params.status = enquiryFilter;
      if (enquirySearch) params.search = enquirySearch;
      const res = await getEnquiries(params);
      setEnquiries(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const params = reviewFilter ? { status: reviewFilter } : {};
      const res = await getAllReviews(params);
      setReviews(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load reviews');
    }
  };

  // FIXED: Use admin endpoint to get ALL blog posts (including unpublished)
  const fetchBlogs = async () => {
    try {
      const res = await getAllBlogsAdmin();
      setBlogPosts(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load blog posts');
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await getGalleryItems();
      setGalleryItems(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load gallery');
    }
  };

  const fetchContact = async () => {
    try {
      const res = await getContactDetails();
      setContact(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load contact details');
    }
  };

  useEffect(() => {
    if (activeTab === 'enquiries') {
      fetchEnquiries();
    } else if (activeTab === 'reviews') {
      fetchReviews();
    } else if (activeTab === 'blog') {
      fetchBlogs();
    } else if (activeTab === 'gallery') {
      fetchGallery();
    } else if (activeTab === 'contact') {
      fetchContact();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, enquiryFilter, enquirySearch, reviewFilter]);

  // Enquiry handlers
  const handleStatusChange = async (id, status) => {
    try {
      await updateEnquiryStatus(id, status);
      fetchEnquiries();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (window.confirm('Delete this enquiry?')) {
      try {
        await deleteEnquiry(id);
        fetchEnquiries();
      } catch (err) {
        alert('Failed to delete enquiry');
      }
    }
  };

  // Review handlers
  const handleApproveReview = async (id) => {
    try {
      await approveReview(id);
      fetchReviews();
    } catch (err) {
      alert('Failed to approve review');
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Delete this review?')) {
      try {
        await deleteReview(id);
        fetchReviews();
      } catch (err) {
        alert('Failed to delete review');
      }
    }
  };

  // Blog handlers with proper error handling
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content || !blogForm.image) {
      alert('Please fill in all required fields: Title, Excerpt, Content, Image URL');
      return;
    }
    try {
      if (editingBlog) {
        await updateBlogPost(editingBlog._id, blogForm);
        alert('Blog updated successfully!');
      } else {
        await createBlogPost(blogForm);
        alert('Blog published successfully!');
      }
      // Reset form and refresh list
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: 'AI Solutions Team',
        published: true,
      });
      setEditingBlog(null);
      await fetchBlogs();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Failed to save blog post';
      alert(`Error: ${message}`);
    }
  };

  const handleEditBlog = (post) => {
    setEditingBlog(post);
    setBlogForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
      published: post.published,
    });
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Delete this blog post?')) {
      try {
        await deleteBlogPost(id);
        alert('Blog deleted');
        await fetchBlogs();
      } catch (err) {
        alert('Failed to delete blog');
      }
    }
  };

  // Gallery handlers
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.image) {
      alert('Title and Image URL are required');
      return;
    }
    try {
      await addGalleryItem(galleryForm);
      setGalleryForm({ title: '', image: '', category: 'event', description: '' });
      await fetchGallery();
      alert('Gallery item added');
    } catch (err) {
      alert('Failed to add gallery item');
    }
  };

  const handleDeleteGallery = async (id) => {
    if (window.confirm('Delete this gallery item?')) {
      try {
        await deleteGalleryItem(id);
        await fetchGallery();
      } catch (err) {
        alert('Failed to delete gallery item');
      }
    }
  };

  // Contact handler
  const handleContactUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateContactDetails(contact);
      alert('Contact details updated successfully!');
    } catch (err) {
      alert('Failed to update contact details');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap border-b mb-6 gap-2">
          {['enquiries', 'reviews', 'blog', 'gallery', 'contact'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          <div>
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">Filter by Status</label>
                <select
                  value={enquiryFilter}
                  onChange={(e) => setEnquiryFilter(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="">All</option>
                  <option value="new">New</option>
                  <option value="processed">Processed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Name, email or company"
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  className="border rounded px-3 py-2 w-64"
                />
              </div>
            </div>
            {loading ? (
              <p className="text-center py-8">Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Company</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq) => (
                      <tr key={enq._id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{enq.name}</td>
                        <td className="p-3">{enq.email}</td>
                        <td className="p-3">{enq.company}</td>
                        <td className="p-3">
                          <select
                            value={enq.status}
                            onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="new">New</option>
                            <option value="processed">Processed</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>
                        <td className="p-3">{new Date(enq.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDeleteEnquiry(enq._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {enquiries.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-gray-500">
                          No enquiries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <label className="block text-sm font-medium mb-1">Filter by Status</label>
              <select
                value={reviewFilter}
                onChange={(e) => setReviewFilter(e.target.value)}
                className="border rounded px-3 py-2"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {rev.name} from {rev.company}
                      </p>
                      <div className="text-yellow-500 my-1">
                        {'★'.repeat(rev.rating)}
                        {'☆'.repeat(5 - rev.rating)}
                      </div>
                      <p className="text-gray-700 mt-2">{rev.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(rev.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-1">
                        Status:{' '}
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                            rev.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : rev.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {rev.status}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {rev.status === 'pending' && (
                        <button
                          onClick={() => handleApproveReview(rev._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(rev._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-center text-gray-500 py-8">No reviews found.</p>
              )}
            </div>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title *"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Excerpt (short summary) *"
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  placeholder="Content (full HTML or markdown) *"
                  rows="6"
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                ></textarea>
                <input
                  type="text"
                  placeholder="Image URL *"
                  value={blogForm.image}
                  onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Author (optional)"
                  value={blogForm.author}
                  onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={blogForm.published}
                    onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                  />
                  Published (visible on the website)
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {editingBlog ? 'Update' : 'Publish'}
                  </button>
                  {editingBlog && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBlog(null);
                        setBlogForm({
                          title: '',
                          excerpt: '',
                          content: '',
                          image: '',
                          author: 'AI Solutions Team',
                          published: true,
                        });
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <h2 className="text-xl font-semibold mb-4">Existing Posts</h2>
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div key={post._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{post.title}</h3>
                    <p className="text-gray-600 text-sm">{post.excerpt}</p>
                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>By {post.author}</span>
                      <span className={post.published ? 'text-green-600' : 'text-red-600'}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditBlog(post)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(post._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {blogPosts.length === 0 && (
                <p className="text-center text-gray-500 py-4">No blog posts yet. Create one above.</p>
              )}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">Add New Gallery Image</h2>
              <form onSubmit={handleGallerySubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title *"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Image URL *"
                  value={galleryForm.image}
                  onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                />
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="event">Event</option>
                  <option value="product">Product</option>
                  <option value="team">Team</option>
                  <option value="workshop">Workshop</option>
                </select>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add to Gallery
                </button>
              </form>
            </div>

            <h2 className="text-xl font-semibold mb-4">Gallery Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">Category: {item.category}</p>
                    {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                    <button
                      onClick={() => handleDeleteGallery(item._id)}
                      className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {galleryItems.length === 0 && (
                <p className="text-center text-gray-500 col-span-3 py-8">No gallery items yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Update Contact Details</h2>
            <form onSubmit={handleContactUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hours</label>
                <input
                  type="text"
                  value={contact.hours}
                  onChange={(e) => setContact({ ...contact, hours: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;