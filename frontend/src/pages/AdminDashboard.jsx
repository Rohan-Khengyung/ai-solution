import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Blog handlers
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
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

  // Navigation items with clean SVG icons
  const navItems = [
    { id: 'enquiries', label: 'Enquiries', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ) },
    { id: 'reviews', label: 'Reviews', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ) },
    { id: 'blog', label: 'Blog', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ) },
    { id: 'gallery', label: 'Gallery', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ) },
    { id: 'contact', label: 'Contact', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ) },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-blue-800 text-white p-2 rounded-lg shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Vertical Sidebar - Dark Blue */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-blue-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand / Logo */}
          <div className="p-5 border-b border-blue-800">
            <Link to="/" className="flex items-center space-x-2 group mb-4">
              <div className="relative">
                <svg className="w-8 h-8 text-blue-400" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4L4 10V22L16 28L28 22V10L16 4Z" stroke="currentColor" strokeWidth="1.5" fill="transparent"/>
                  <path d="M16 16L10 13M16 16L22 13M16 16V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="16" cy="10" r="2" fill="currentColor"/>
                </svg>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">AI-Solutions</span>
            </Link>
            <p className="text-sm text-blue-200">AI-powered solutions for the modern digital enterprise.</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      activeTab === item.id
                        ? 'bg-blue-700 text-white shadow-md'
                        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button at bottom */}
          <div className="p-4 border-t border-blue-800">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center space-x-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 border-l-4 border-blue-800 pl-3">
              {navItems.find((i) => i.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          {/* Enquiries Tab */}
          {activeTab === 'enquiries' && (
            <div>
              <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                  <select
                    value={enquiryFilter}
                    onChange={(e) => setEnquiryFilter(e.target.value)}
                    className="border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All</option>
                    <option value="new">New</option>
                    <option value="processed">Processed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    placeholder="Name, email or company"
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="border rounded px-3 py-2 w-64 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              {loading ? (
                <p className="text-center py-8 text-gray-500">Loading enquiries...</p>
              ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700">Company</th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700">Date</th>
                        <th className="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map((enq) => (
                        <tr key={enq._id} className="border-t hover:bg-gray-50">
                          <td className="p-3 text-sm">{enq.name}</td>
                          <td className="p-3 text-sm">{enq.email}</td>
                          <td className="p-3 text-sm">{enq.company}</td>
                          <td className="p-3">
                            <select
                              value={enq.status}
                              onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                              className="border rounded px-2 py-1 text-sm focus:ring-blue-500"
                            >
                              <option value="new">New</option>
                              <option value="processed">Processed</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="p-3 text-sm">{new Date(enq.createdAt).toLocaleDateString()}</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleDeleteEnquiry(enq._id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                <select
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                  className="border rounded px-3 py-2 focus:ring-blue-500"
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
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {rev.name} <span className="text-gray-500 text-sm">from {rev.company}</span>
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
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
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
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
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
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h2>
                <form onSubmit={handleBlogSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title *"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    required
                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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
                  />
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
                  <label className="flex items-center gap-2 text-gray-700">
                    <input
                      type="checkbox"
                      checked={blogForm.published}
                      onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                    />
                    Published (visible on website)
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition"
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

              <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Posts</h2>
              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <div key={post._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-start flex-wrap gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{post.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
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
                        className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(post._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
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
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Gallery Image</h2>
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
                    className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition"
                  >
                    Add to Gallery
                  </button>
                </form>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-4">Gallery Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-lg shadow overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Contact Details</h2>
              <form onSubmit={handleContactUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    required
                    className="w-full border rounded px-3 py-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={contact.address}
                    onChange={(e) => setContact({ ...contact, address: e.target.value })}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
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
                  className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-900 transition"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;